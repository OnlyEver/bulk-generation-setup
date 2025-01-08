import { Queue } from "bullmq";

/// look into the job result , and as per the job type and returned data, determine what will be the next job for the queue
/// and prepare the params for next job, and add that to queue
/// if nothing needs to be done, then terminate the worker
export function handleQueueCompletion(queue: any) {
  console.log(`Queue ${queue.id} is completed`);
}
