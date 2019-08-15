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
        document.documentElement.style.setProperty('--shortcut-hint-display', 'show');
      }
    });
    window.addEventListener('keyup', (e) => {
      if (this.hintDisplayed) {
        this.hintDisplayed = false;
        document.documentElement.style.setProperty('--shortcut-hint-display', 'none');
      }
    });
  }
}
angular.module('shortcutHintEvents')
  .directive('shortcutHint', [
    () => new ShortcutHintEvent(),
  ]);
