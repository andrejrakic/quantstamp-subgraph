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
import { ExampleEntity } from "../generated/schema"

export function handleLogAuditFinished(event: LogAuditFinished): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.requestId = event.params.requestId
  entity.auditor = event.params.auditor

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.reportData(...)
  // - contract.isAuditFinished(...)
  // - contract.requestAudit(...)
  // - contract.refund(...)
  // - contract.getNextAuditByPrice(...)
  // - contract.unstake(...)
  // - contract.myMostRecentAssignedAudit(...)
  // - contract.mostRecentAssignedRequestIdsPerAuditor(...)
  // - contract.submitPoliceReport(...)
  // - contract.claimRewards(...)
  // - contract.requestAuditWithPriceHint(...)
  // - contract.totalStakedFor(...)
  // - contract.getReport(...)
  // - contract.getNextAvailableReward(...)
  // - contract.getNextAssignedRequest(...)
  // - contract.getMinAuditPriceLowerCap(...)
  // - contract.paused(...)
  // - contract.auditData(...)
  // - contract.anyRequestAvailable(...)
  // - contract.hasEnoughStake(...)
  // - contract.getMaxAssignedRequests(...)
  // - contract.getAuditTimeoutInBlocks(...)
  // - contract.owner(...)
  // - contract.getNextPrice(...)
  // - contract.getMinAuditStake(...)
  // - contract.hasAvailableRewards(...)
  // - contract.stake(...)
  // - contract.tokenEscrow(...)
  // - contract.claimReward(...)
  // - contract.police(...)
  // - contract.assignedRequestCount(...)
  // - contract.findPrecedingPrice(...)
  // - contract.isPoliceNode(...)
  // - contract.getNextPoliceAssignment(...)
  // - contract.getMinAuditPrice(...)
}

export function handleLogPoliceAuditFinished(
  event: LogPoliceAuditFinished
): void {}

export function handleLogAuditRequested(event: LogAuditRequested): void {}

export function handleLogAuditAssigned(event: LogAuditAssigned): void {}

export function handleLogReportSubmissionError_InvalidAuditor(
  event: LogReportSubmissionError_InvalidAuditor
): void {}

export function handleLogReportSubmissionError_InvalidState(
  event: LogReportSubmissionError_InvalidState
): void {}

export function handleLogReportSubmissionError_InvalidResult(
  event: LogReportSubmissionError_InvalidResult
): void {}

export function handleLogReportSubmissionError_ExpiredAudit(
  event: LogReportSubmissionError_ExpiredAudit
): void {}

export function handleLogAuditAssignmentError_ExceededMaxAssignedRequests(
  event: LogAuditAssignmentError_ExceededMaxAssignedRequests
): void {}

export function handleLogAuditAssignmentError_Understaked(
  event: LogAuditAssignmentError_Understaked
): void {}

export function handleLogAuditAssignmentUpdate_Expired(
  event: LogAuditAssignmentUpdate_Expired
): void {}

export function handleLogClaimRewardsReachedGasLimit(
  event: LogClaimRewardsReachedGasLimit
): void {}

export function handleLogAuditQueueIsEmpty(event: LogAuditQueueIsEmpty): void {}

export function handleLogPayAuditor(event: LogPayAuditor): void {}

export function handleLogAuditNodePriceChanged(
  event: LogAuditNodePriceChanged
): void {}

export function handleLogRefund(event: LogRefund): void {}

export function handleLogRefundInvalidRequestor(
  event: LogRefundInvalidRequestor
): void {}

export function handleLogRefundInvalidState(
  event: LogRefundInvalidState
): void {}

export function handleLogRefundInvalidFundsLocked(
  event: LogRefundInvalidFundsLocked
): void {}

export function handleLogAuditNodePriceHigherThanRequests(
  event: LogAuditNodePriceHigherThanRequests
): void {}

export function handlePause(event: Pause): void {}

export function handleUnpause(event: Unpause): void {}

export function handleOwnershipRenounced(event: OwnershipRenounced): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}
