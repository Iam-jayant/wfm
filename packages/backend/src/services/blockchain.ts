import { ethers } from 'ethers';

export interface BlockchainEvent {
  workerId: string;
  eventType: 'check_in' | 'check_out' | 'job_assignment' | 'job_completion';
  timestamp: Date;
  location?: { latitude: number; longitude: number };
  jobId?: string;
  dataHash: string;
}

export interface BlockchainLogResult {
  transactionHash: string;
  blockNumber?: number;
  gasUsed?: string;
  success: boolean;
  error?: string;
}

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  private isEnabled: boolean = false;

  constructor() {
    this.initializeBlockchain();
  }

  private initializeBlockchain() {
    try {
      const rpcUrl = process.env.ETHEREUM_RPC_URL;
      const privateKey = process.env.PRIVATE_KEY;

      // For MVP, we'll use demo configuration
      if (rpcUrl && privateKey && rpcUrl !== 'demo-project-id' && privateKey !== 'demo-private-key') {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.isEnabled = true;
        console.log('Blockchain service initialized with Ethereum provider');
      } else {
        console.log('Blockchain service running in demo mode (no real transactions)');
        this.isEnabled = false;
      }
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      this.isEnabled = false;
    }
  }

  private generateDataHash(event: BlockchainEvent): string {
    const data = JSON.stringify({
      workerId: event.workerId,
      eventType: event.eventType,
      timestamp: event.timestamp.toISOString(),
      location: event.location,
      jobId: event.jobId
    });
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  }

  async logEvent(event: BlockchainEvent): Promise<BlockchainLogResult> {
    try {
      // Generate hash for the event data
      const dataHash = this.generateDataHash(event);
      event.dataHash = dataHash;

      if (!this.isEnabled || !this.wallet) {
        // Demo mode - simulate blockchain logging
        console.log('Demo blockchain log:', {
          eventType: event.eventType,
          workerId: event.workerId,
          dataHash: dataHash,
          timestamp: event.timestamp
        });

        return {
          transactionHash: `demo_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          gasUsed: '21000',
          success: true
        };
      }

      // Real blockchain transaction (when properly configured)
      const transaction = {
        to: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
        value: ethers.parseEther('0'), // No ETH transfer, just data
        data: dataHash, // Store the hash as transaction data
        gasLimit: 50000
      };

      const txResponse = await this.wallet.sendTransaction(transaction);
      const receipt = await txResponse.wait();

      return {
        transactionHash: txResponse.hash,
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        success: true
      };

    } catch (error) {
      console.error('Blockchain logging failed:', error);
      return {
        transactionHash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown blockchain error'
      };
    }
  }

  async logCheckIn(workerId: string, location: { latitude: number; longitude: number }, jobId?: string): Promise<BlockchainLogResult> {
    const event: BlockchainEvent = {
      workerId,
      eventType: 'check_in',
      timestamp: new Date(),
      location,
      jobId,
      dataHash: ''
    };

    return this.logEvent(event);
  }

  async logCheckOut(workerId: string, location: { latitude: number; longitude: number }, jobId?: string): Promise<BlockchainLogResult> {
    const event: BlockchainEvent = {
      workerId,
      eventType: 'check_out',
      timestamp: new Date(),
      location,
      jobId,
      dataHash: ''
    };

    return this.logEvent(event);
  }

  async logJobAssignment(workerId: string, jobId: string): Promise<BlockchainLogResult> {
    const event: BlockchainEvent = {
      workerId,
      eventType: 'job_assignment',
      timestamp: new Date(),
      jobId,
      dataHash: ''
    };

    return this.logEvent(event);
  }

  async logJobCompletion(workerId: string, jobId: string, location?: { latitude: number; longitude: number }): Promise<BlockchainLogResult> {
    const event: BlockchainEvent = {
      workerId,
      eventType: 'job_completion',
      timestamp: new Date(),
      location,
      jobId,
      dataHash: ''
    };

    return this.logEvent(event);
  }

  async verifyEventHash(originalEvent: BlockchainEvent, storedHash: string): Promise<boolean> {
    const computedHash = this.generateDataHash(originalEvent);
    return computedHash === storedHash;
  }

  getConnectionStatus(): { connected: boolean; network?: string; address?: string } {
    if (!this.isEnabled || !this.wallet) {
      return { connected: false };
    }

    return {
      connected: true,
      network: 'sepolia', // or get from provider
      address: this.wallet.address
    };
  }
}

export const blockchainService = new BlockchainService();