import { WebWidgetPage } from './app.po';

describe('web-widget App', () => {
  let page: WebWidgetPage;

  beforeEach(() => {
    page = new WebWidgetPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
