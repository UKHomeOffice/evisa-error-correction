import { BasePage } from './base-page';

export class EecShipAndPortDetailsPage extends BasePage {
  readonly correctShipName = this.page.locator('#correct-ship-name');
  readonly correctPortName = this.page.locator('#correct-port-name');
  async expectedPageTitle(): Promise<string> {
    const title = await this.page.title();

    return title.startsWith('Error')
      ? 'Error: Check your answers before sending your request – Report an error with your eVisa'
      : 'Check your answers before sending your request – Report an error with your eVisa';
  }

  async enterCorrectName(value: string) {
    const [ship = '', port = ''] = value.trim().split(/\s+/, 2);
    await this.type(this.correctShipName, ship);
    await this.type(this.correctPortName, port);
  }
}
