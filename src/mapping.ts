import { BigInt } from "@graphprotocol/graph-ts"
import {
  QuantstampAudit,
  LogAuditFinished,
  LogPoliceAuditFinished,
  LogAuditRequested,
  LogAuditAssigned,
  LogReportSubmissionError_InvalidAuditor,
  LogReportSubmissionError_InvalidState,
  LogReportSubmissionError_InvalidResult,
  LogReportSubmissionError_ExpiredAudit,
  LogAuditAssignmentError_ExceededMaxAssignedRequests,
  LogAuditAssignmentError_Understaked,
  LogAuditAssignmentUpdate_Expired,
  LogClaimRewardsReachedGasLimit,
  LogAuditQueueIsEmpty,
  LogPayAuditor,
  LogAuditNodePriceChanged,
  LogRefund,
  LogRefundInvalidRequestor,
  LogRefundInvalidState,
  LogRefundInvalidFundsLocked,
  LogAuditNodePriceHigherThanRequests,
  Pause,
  Unpause,
  OwnershipRenounced,
  OwnershipTransferred
} from "../generated/QuantstampAudit/QuantstampAudit"
import { 
  Report, 
  Audit, 
  SmartContract, 
  AuditNode, 
  PoliceNode, 
  Refund,
  LogReportSubmissionError_InvalidAuditorEntity, 
  LogReportSubmissionError_InvalidStateEntity,
  LogReportSubmissionError_InvalidResultEntity,
  LogReportSubmissionError_ExpiredAuditEntity,
  LogAuditAssignmentError_UnderstakedEntity,
  LogAuditAssignmentUpdate_ExpiredEntity,
  LogRefund_InvalidRequestor,
  LogRefund_InvalidState,
  LogRefund_InvalidFundsLocked
} from "../generated/schema"

enum AuditState {
  None,
  Queued,
  Assigned,
  Refunded,
  Completed,  // automated audit finished successfully and the report is available
  Error,      // automated audit failed to finish; the report contains detailed information about the error
  Expired,
  Resolved
}

export function handleLogAuditRequested(event: LogAuditRequested): void {
  let auditEntity = new Audit(event.params.requestId.toHex());

  let smartContractEntity = new SmartContract(event.params.uri);
  smartContractEntity.save();

  auditEntity.requestor = event.params.requestor;
  auditEntity.price = event.params.price;
  auditEntity.contract = smartContractEntity.id;
  auditEntity.isVerified = false;
  auditEntity.auditState = AuditState.Queued;
  auditEntity.requestTimestamp = event.block.timestamp;

  auditEntity.save();
}

export function handleLogAuditAssigned(event: LogAuditAssigned): void {
  let auditEntity = Audit.load(event.params.requestId.toHex());
  let auditNodeEntity = AuditNode.load(event.params.auditor.toHex());

  if(auditNodeEntity == null) {
    auditNodeEntity = new AuditNode(event.params.auditor.toHex());
    auditNodeEntity.save();
  }

  auditEntity.auditor = auditNodeEntity.id;
  auditEntity.auditState = AuditState.Assigned;
  auditEntity.assignTimestamp = event.block.timestamp;

  auditEntity.save();
}

export function handleLogAuditFinished(event: LogAuditFinished): void {
  let auditEntity = Audit.load(event.params.requestId.toHex());
  let reportEntity = new Report(event.params.requestId.toHex());

  reportEntity.reportText = event.params.report;
  reportEntity.contract = auditEntity.contract;
  reportEntity.auditor = event.params.auditor.toHex();
  
  auditEntity.auditState = event.params.auditResult;
  auditEntity.reportTimestamp = event.block.timestamp;

  auditEntity.save();
  reportEntity.save();
}

export function handleLogPoliceAuditFinished(event: LogPoliceAuditFinished): void {
  let policeNodeEntity = PoliceNode.load(event.params.policeNode.toHex());

  if(policeNodeEntity == null) {
    policeNodeEntity = new PoliceNode(event.params.policeNode.toHex());
    policeNodeEntity.save();
  }

  let auditEntity = Audit.load(event.params.requestId.toHex());

  auditEntity.isVerified = event.params.isVerified;
  auditEntity.policeAuditor = policeNodeEntity.id;
  auditEntity.policeReport = event.params.report;

  auditEntity.save();
}

export function handleLogReportSubmissionError_InvalidAuditor(event: LogReportSubmissionError_InvalidAuditor): void {
  let entity = new LogReportSubmissionError_InvalidAuditorEntity(event.transaction.hash.toHex());

  entity.txHash = event.transaction.hash;
  entity.block = event.block.hash;
  entity.timestamp = event.block.timestamp;
  entity.invalidAuditor = event.params.auditor;
  entity.requestId = event.params.requestId;

  entity.save();
}

export function handleLogReportSubmissionError_InvalidState(event: LogReportSubmissionError_InvalidState): void {
  let entity = new LogReportSubmissionError_InvalidStateEntity(event.transaction.hash.toHex());

  entity.txHash = event.transaction.hash;
  entity.block = event.block.hash;
  entity.timestamp = event.block.timestamp;
  entity.auditor = event.params.auditor;
  entity.requestId = event.params.requestId;
  entity.invalidState = event.params.state;

  entity.save();
}

export function handleLogReportSubmissionError_InvalidResult(event: LogReportSubmissionError_InvalidResult): void {
  let entity = new LogReportSubmissionError_InvalidResultEntity(event.transaction.hash.toHex());

  entity.txHash = event.transaction.hash;
  entity.block = event.block.hash;
  entity.timestamp = event.block.timestamp;
  entity.auditor = event.params.auditor;
  entity.requestId = event.params.requestId;
  entity.invalidState = event.params.state;

  entity.save();
}

export function handleLogReportSubmissionError_ExpiredAudit(event: LogReportSubmissionError_ExpiredAudit): void {
  let entity = new LogReportSubmissionError_ExpiredAuditEntity(event.transaction.hash.toHex());

  entity.txHash = event.transaction.hash;
  entity.block = event.block.hash;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.auditor = event.params.auditor;
  entity.requestId = event.params.requestId;
  entity.allowanceBlockNumber = event.params.allowanceBlockNumber;

  entity.save();
}

export function handleLogAuditAssignmentError_ExceededMaxAssignedRequests(event: LogAuditAssignmentError_ExceededMaxAssignedRequests): void {
}

export function handleLogAuditAssignmentError_Understaked(event: LogAuditAssignmentError_Understaked): void {
  let entity = new LogAuditAssignmentError_UnderstakedEntity(event.transaction.hash.toHex());

  entity.txHash = event.transaction.hash;
  entity.block = event.block.hash;
  entity.timestamp = event.block.timestamp;
  entity.auditor = event.params.auditor;
  entity.invalidStake = event.params.stake;

  entity.save();
}

export function handleLogAuditAssignmentUpdate_Expired(event: LogAuditAssignmentUpdate_Expired): void {
  let entity = new LogAuditAssignmentUpdate_ExpiredEntity(event.transaction.hash.toHex());

  entity.txHash = event.transaction.hash;
  entity.block = event.block.hash;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.requestId = event.params.requestId;
  entity.allowanceBlockNumber = event.params.allowanceBlockNumber;

  entity.save();
}

export function handleLogClaimRewardsReachedGasLimit(
  event: LogClaimRewardsReachedGasLimit
): void {}

export function handleLogAuditQueueIsEmpty(event: LogAuditQueueIsEmpty): void {}

export function handleLogPayAuditor(event: LogPayAuditor): void {
  let auditEntity = Audit.load(event.params.requestId.toHex());
  let auditNodeEntity = AuditNode.load(auditEntity.auditor);
  let policeNodeEntity = PoliceNode.load(auditEntity.policeAuditor);

  if(policeNodeEntity == null) {
    policeNodeEntity = new PoliceNode(auditEntity.policeAuditor);
  }

  auditNodeEntity.feeCollected = auditNodeEntity.feeCollected.plus(event.params.amount);

  let policeFee = auditEntity.price.minus(event.params.amount);
  policeNodeEntity.feeCollected = policeNodeEntity.feeCollected.plus(policeFee);

  auditNodeEntity.save();
  policeNodeEntity.save();
}

export function handleLogAuditNodePriceChanged(event: LogAuditNodePriceChanged): void {
  let auditNodeEntity = AuditNode.load(event.params.auditor.toHex());

  if(auditNodeEntity == null) {
    auditNodeEntity = new AuditNode(event.params.auditor.toHex());
  }

  auditNodeEntity.price = event.params.amount;

  auditNodeEntity.save();
}

export function handleLogRefund(event: LogRefund): void {
  let refundEntity = new Refund(event.params.requestId.toHex());

  refundEntity.requestor = event.params.requestor;
  refundEntity.price = event.params.amount;

  refundEntity.save();
}

export function handleLogRefundInvalidRequestor(event: LogRefundInvalidRequestor): void {
  let entity = new LogRefund_InvalidRequestor(event.transaction.hash.toHex());

  entity.txHash = event.transaction.hash;
  entity.block = event.block.hash;
  entity.timestamp = event.block.timestamp;
  entity.requestId = event.params.requestId;
  entity.invalidRequestor = event.params.requestor;

  entity.save();
}

export function handleLogRefundInvalidState(event: LogRefundInvalidState): void {
  let auditEntity = Audit.load(event.params.requestId.toHex());
  let errorEntity = new LogRefund_InvalidState(event.transaction.hash.toHex());
  
  auditEntity.auditState = event.params.state;

  errorEntity.txHash = event.transaction.hash;
  errorEntity.block = event.block.hash;
  errorEntity.timestamp = event.block.timestamp;
  errorEntity.requestId = event.params.requestId;
  errorEntity.invalidState = event.params.state;

  auditEntity.save();
  errorEntity.save();
}

export function handleLogRefundInvalidFundsLocked(event: LogRefundInvalidFundsLocked): void {
  let entity = new LogRefund_InvalidFundsLocked(event.transaction.hash.toHex());

  entity.txHash = event.transaction.hash;
  entity.block = event.block.hash;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp;
  entity.requestId = event.params.requestId;
  entity.currentBlock = event.params.currentBlock;
  entity.fundLockEndBlock = event.params.fundLockEndBlock;

  entity.save();
}

export function handleLogAuditNodePriceHigherThanRequests(
  event: LogAuditNodePriceHigherThanRequests
): void {}

export function handlePause(event: Pause): void {}

export function handleUnpause(event: Unpause): void {}

export function handleOwnershipRenounced(event: OwnershipRenounced): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
