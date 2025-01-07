const generationComplete = () =>
  new Promise((res, rej) => setTimeout(() => res(), 2 * 1000));

export async function generationProcess(data) {
  console.log("Generation process started");
  // handle generation here
  await generationComplete();
  console.log("Generation process completed");
  return "Success";
}
