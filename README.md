# Quantstamp Subgraph

The Protocol for Securing & Auditing Smart Contracts. Use QSP tokens to validate your Solidity code, with off-chain computation from auditor nodes.

This subgraph dynamically provides info about smart contract Audits on this platform, gets historical reports both by audit nodes and police nodes, stores all the info about audited smart contracts, track refunds of QSP tokens and log every exception ever happened.

**Subgraph on The Graph Explorer**: _https://thegraph.com/explorer/subgraph/andrejrakic/quantstamp_

**Smart Contract on Etherscan**: _https://etherscan.io/address/0x5a0e27020FA22AdaB2e81495025bEF3Fab7821fd#code_

**Dapp**: _https://protocol.quantstamp.com/_

**Analytics Page**: __

## Example Queries

### Get All Audits

```
{
  audits {
    id
    auditState
    requestor
    price
    contract {
      id
    }
    isVerified
    auditor {
      id
    }
    policeAuditor {
      id
    }
    report {
      id
      reportText
    }
    policeReport
    requestTimestamp
    assignTimestamp
    reportTimestamp
  }
}
```

### Get Vulnerabilities Reports

```
{
  reports {
    id
    auditor {
      id
    }
    reportText
    contract {
      id
    }
  }
}
```

### Get Smart Contracts Audited via Quantstamp

```
{
  smartContracts {
    id
    vulnerabilities
  }
}
```
