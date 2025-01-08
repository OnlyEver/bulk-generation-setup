import { sendGeneration } from "../generation-jobs/send_generation";

const generationComplete = () =>
  new Promise<void>((res, rej) => setTimeout(() => res(), 2 * 1000));

export async function generationProcess(data: any) {
  console.log("Generation process started");
  // handle generation here
  const generationinfo = await sendGeneration();
  console.log("Generation process completed");
  return "Success";
}
