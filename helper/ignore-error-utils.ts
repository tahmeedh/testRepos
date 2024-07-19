import { Log } from 'Apis/api-helpers/log-utils';

export class IgnoreErrorUtils {
    /**
     * Allow an action to fail and catches its error, to prevent it from failing test.
     * This is useful in scenarios where SMS/WA/Portal/Desktop notification is not displayed consistently.
     * Notes: Wrap the action inside an anonymous function to prevent action from being triggered when passing an action with a parameter.
     * @example
     * await IgnoreErrorUtils.ignoreError(async function () { await app.portalController.closeEnableDesktopNotification() })
     * @param action The method you want to continue to run when an error occur.
     * @returns Promise <void>
     */
    static ignoreError(action: () => Promise<void>) {
        return action().catch((error) => {
            Log.error('An error occurred.', error);
            Log.highlight('Ignoring error and continue to next step.');
        });
    }
}
