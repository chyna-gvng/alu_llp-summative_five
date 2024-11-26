module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match Ganache's network ID
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",  // Match the exact version from your compilation
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  mocha: {
    timeout: 100000
  }
};
