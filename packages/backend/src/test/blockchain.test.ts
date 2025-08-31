import { blockchainService } from '../services/blockchain';

describe('Blockchain Service', () => {
  test('should log check-in event', async () => {
    const result = await blockchainService.logCheckIn(
      'worker1',
      { latitude: 28.6139, longitude: 77.2090 },
      'job1'
    );

    expect(result.success).toBe(true);
    expect(result.transactionHash).toBeDefined();
    expect(result.transactionHash.length).toBeGreaterThan(0);
  });

  test('should log job assignment event', async () => {
    const result = await blockchainService.logJobAssignment('worker1', 'job1');

    expect(result.success).toBe(true);
    expect(result.transactionHash).toBeDefined();
    expect(result.transactionHash.length).toBeGreaterThan(0);
  });

  test('should return connection status', () => {
    const status = blockchainService.getConnectionStatus();
    expect(status).toHaveProperty('connected');
    expect(typeof status.connected).toBe('boolean');
  });

  test('should log check-out event', async () => {
    const result = await blockchainService.logCheckOut(
      'worker1',
      { latitude: 28.6139, longitude: 77.2090 },
      'job1'
    );

    expect(result.success).toBe(true);
    expect(result.transactionHash).toBeDefined();
  });

  test('should log job completion event', async () => {
    const result = await blockchainService.logJobCompletion(
      'worker1',
      'job1',
      { latitude: 28.6139, longitude: 77.2090 }
    );

    expect(result.success).toBe(true);
    expect(result.transactionHash).toBeDefined();
  });
});