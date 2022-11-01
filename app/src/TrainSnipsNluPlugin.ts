import { axios, Plugin, PluginConfig } from '@jovotech/framework';
import * as fs from 'fs';

export class TrainSnipsNluPlugin extends Plugin {
  getDefaultConfig(): PluginConfig {
    return {};
  }

  async initialize(): Promise<void> {
    try {
      await this.trainModel();
    } catch (e) {
      console.log(e);
    }
  }

  async trainModel(): Promise<void> {
    const model = fs.readFileSync(process.cwd() + '/models/en-US.json', 'utf8');
    await axios.post(
      `${process.env.SNIPS_NLU_URL}/engine/train?engine_id=sample-app&locale=en`,
      JSON.parse(model),
    );
  }
}
