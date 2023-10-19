interface TransactionRecord {
    investorID: string;
    syndicateID: string;
    transactionAmount: number;
    transactionDate: string;
  }
  
  //Let's consider dataset is an array of object
  const dataset: TransactionRecord[] = [
    { investorID: 'A1', syndicateID: 'S1', transactionAmount: 1000, transactionDate: '2023-01-01' },
    { investorID: 'A2', syndicateID: 'S1', transactionAmount: 500, transactionDate: '2023-01-02' },
    { investorID: 'A1', syndicateID: 'S2', transactionAmount: 750, transactionDate: '2023-01-03' },
    // Add more dataset entries as needed
  ];
  
  async function processDataset(dataset: TransactionRecord[]) {
    const investorData = new Map<string, { syndicates: Set<string>, totalAmount: number }>();
  
    // Process each record in parallel using Promise.all
    await Promise.all(
      dataset.map(async (record) => {
        const { investorID, syndicateID, transactionAmount } = record;
  
        // Simulate an asynchronous operation (e.g., reading from a database or API)
        await simulateAsyncOperation();
  
        // Update investor data
        if (investorData.has(investorID)) {
          const data = investorData.get(investorID)!;
          data.syndicates.add(syndicateID);
          data.totalAmount += transactionAmount;
        } else {
          investorData.set(investorID, {
            syndicates: new Set([syndicateID]),
            totalAmount: transactionAmount,
          });
        }
      })
    );
  
    // Convert the Map to an array for sorting
    const investorArray = Array.from(investorData.entries());
  
    // Sort investors by the number of unique syndicates and total amount invested
    investorArray.sort((a, b) => {
      if (b[1].syndicates.size !== a[1].syndicates.size) {
        return b[1].syndicates.size - a[1].syndicates.size;
      }
      return b[1].totalAmount - a[1].totalAmount;
    });
  
    // Display the top 5 investors
    const top5Investors = investorArray.slice(0, 5);
    for (const [investorID, data] of top5Investors) {
      console.log(`Investor ID: ${investorID}`);
      console.log(`Number of Unique Syndicates: ${data.syndicates.size}`);
      console.log(`Total Amount Invested: $${data.totalAmount.toFixed(2)}`);
      console.log('------------------------');
    }
  }
  
  // Simulate an asynchronous operation (e.g., reading from a database or API)
  function simulateAsyncOperation() {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 1); // Simulated delay
    });
  }
  
  processDataset(dataset);
  