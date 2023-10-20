import { Queue } from 'queue-library'; // Use a queue library
import { AlertManager } from './alertManager'; // Defining  AlertManager class

// Defining Transaction interface to represent a transaction.
interface Transaction {
  syndicateId: string;
  amount: number;
  timestamp: number;
}

// Defining a class to manage the system.
class RealTimeAlertingSystem {
  private db: Database; // Using chosen database class
  private syndicateData: Map<string, SyndicateInfo> = new Map();
  private transactionQueue: Queue<Transaction> = new Queue();
  private recentTransactions: Map<string, Transaction[]> = new Map();

  constructor(db: Database) {
    this.db = db;
  }

  public processTransaction(transaction: Transaction): void {
    // Adding transaction to the queue
    this.transactionQueue.enqueue(transaction);

   // Checking if the transaction amount exceeds the predefined threshold
const syndicateInfo = this.syndicateData.get(transaction.syndicateId);
if (syndicateInfo && transaction.amount > syndicateInfo.threshold) {
  AlertManager.triggerAlert('Threshold exceeded', transaction);
}

    // Maintaining recent transactions data structure
    this.recentTransactions
      .get(transaction.syndicateId)
      ?.push(transaction);

    // Checking for spikes in transaction rate
    if (this.checkForSpike(transaction.syndicateId)) {
      AlertManager.triggerAlert('Transaction rate spike', transaction);
    }
  }

  private checkForSpike(syndicateId: string): boolean {
    // Calculating the rate of transactions for the last hour
    const lastHour = this.getTransactionsWithinLastHour(
      this.recentTransactions.get(syndicateId) || []
    );
    const averageRate = this.calculateAverageRate(lastHour);

    // Checking for a spike in transaction rate
    return (
      (this.recentTransactions.get(syndicateId) || []).length >
      10 * averageRate
    );
  }

  private getTransactionsWithinLastHour(
    transactions: Transaction[]
  ): Transaction[] {
    // Filtering transactions within the last hour
    const oneHourAgo = Date.now() - 3600000; // 1 hour in milliseconds
    return transactions.filter(
      (transaction) => transaction.timestamp >= oneHourAgo
    );
  }

  private calculateAverageRate(transactions: Transaction[]): number {
    return transactions.length / 3600; // Transactions per second
  }

  // Initializing data structures and start processing incoming transactions
  public initializeSystem(): void {
    
    // We can also set up database connections, alerting systems, etc.
  }
}

// Defining a class to represent syndicate information.
class SyndicateInfo {
  constructor(public threshold: number) {}
}

// Example database class.
class Database {
  // Methods to interact with chosen database
}

// Example AlertManager class.
class AlertManager {
  public static triggerAlert(type: string, transaction: Transaction): void {
    // alerting logic here
  }
}

// Initializing the system with a database instance.
const db = new Database();
const alertingSystem = new RealTimeAlertingSystem(db);
alertingSystem.initializeSystem();
