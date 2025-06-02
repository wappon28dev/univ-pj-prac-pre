console.log("shared-data.js loaded");

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(
    () => {
      window.parent.postMessage(
        {
          type: "sharedData",
          data: {
            message: "Hello from the shared data script!",
            timestamp: new Date().toISOString(),
          },
        },
        "*",
      );
    },
    1000,
  );
  console.log("Shared data sent to parent window");
});
