angular.module('shortcutHintEvents', []);

// shortcut key hint
class ShortcutHintEvent implements yubo.ShortcutHintEvent {
  private hintDisplayed: boolean = false;
  constructor(
  ) {}
  link(scope: ng.IScope): void {
    window.addEventListener('keydown', (e) => {
      if (e.metaKey) {
        this.hintDisplayed = true;
        document.documentElement.style.setProperty('--shortcut-hint-delay', '1s');
        document.documentElement.style.setProperty('--shortcut-hint-opacity', '1');
      }
    });
    window.addEventListener('keyup', (e) => {
      if (this.hintDisplayed) {
        this.hintDisplayed = false;
        document.documentElement.style.setProperty('--shortcut-hint-delay', '0s');
        document.documentElement.style.setProperty('--shortcut-hint-opacity', '0');
      }
    });
    window.addEventListener('blur', (e) => {
      if (this.hintDisplayed) {
        this.hintDisplayed = false;
        document.documentElement.style.setProperty('--shortcut-hint-delay', '0s');
        document.documentElement.style.setProperty('--shortcut-hint-opacity', '0');
      }
    });
  }
}
angular.module('shortcutHintEvents')
  .directive('shortcutHint', [
    () => new ShortcutHintEvent(),
  ]);
