# AfriCO-X: Decentralized Carbon Credit Trading Platform

## Overview
AfriCO-X is a blockchain-based platform that enables transparent and secure trading of carbon credits. Built on Ethereum, it allows environmental projects in Africa to tokenize their carbon credits as ERC-20 tokens (CCT) for global trading.

## Features
- Carbon Credit Tokenization (ERC-20 CCT tokens)
- DAO-based governance for project approval
- Decentralized trading platform
- Transparent project registration and verification

## Smart Contracts
- `CarbonCreditToken.sol`: ERC-20 token implementation for carbon credits
- `ProjectRegistration.sol`: Handles project submission and verification
- `Governance.sol`: Manages DAO voting and project approval

## Prerequisites
- Node.js v16.0.0
- npm v7.10.0
- MetaMask browser extension
- Truffle
- Ganache

## Installation

1. Clone the repository:
```bash
git clone https://github.com/chyna-gvng/alu_llp-summative_five.git
cd alu_llp-summative_five
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp example.env .env
```
Edit `.env` with your:
- Mnemonic phrase
- Alchemy API key
- Initial owner address

## Local Testing

1. Start Ganache:
```bash
ganache
```

2. In a new terminal, compile contracts:
```bash
truffle compile
```

3. Run tests:
```bash
truffle test
```

## Testnet Deployment (Sepolia)

1. Ensure your `.env` is configured with Sepolia network details

2. Deploy contracts:
```bash
truffle migrate --network sepolia
```

## Test Cases

### CarbonCreditToken
1. Token Minting
   - Expected: Owner can mint tokens to specified address
   - Actual: ✅ Tokens minted successfully with correct balance

2. Token Burning 
   - Expected: Token holders can burn their tokens
   - Actual: ✅ Tokens burned successfully, balance updated

### ProjectRegistration
1. Project Submission
   - Expected: Users can submit project details
   - Actual: ✅ Project stored with correct name and details

2. Project Verification
   - Expected: Only owner can verify projects
   - Actual: ✅ Projects verified successfully by owner

### Governance
1. Voting Rights
   - Expected: Only CCT holders can vote
   - Actual: ✅ Non-holders prevented from voting

2. Vote Counting
   - Expected: Project approved when votes > 50% of token supply
   - Actual: ✅ Project automatically verified at threshold

## Security Considerations
- ReentrancyGuard implemented in Governance contract
- Access control via Ownable pattern
- ERC20 implementation from OpenZeppelin
