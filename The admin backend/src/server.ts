import { env } from "./config/env";
import { app } from "./app";

app.listen(env.PORT, () => {
  console.log(`BullPort backend running on http://localhost:${env.PORT}`);
});
