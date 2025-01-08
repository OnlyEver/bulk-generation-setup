import { Queue } from "bullmq";

function handleQueueCompletion(queue: any) {
  console.log(`Queue ${queue.id} is completed`);
  /// look into the queue,  and as per the job type, determine what will be the next job for the queue
  /// if the queue is generation queue, then the next job will be the processing job
}
