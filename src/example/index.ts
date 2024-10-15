import GlobalUser from "./model/User";

describe('GlobalUserTest', () => {
    beforeEach(() => {
        GlobalUser.clear();
    });

    test('Set and get email', () => {
        GlobalUser.set({ email: "awesome@kate.com", phone: "001225" });
        expect(GlobalUser.get()?.["email"]).toBe("awesome@kate.com");
    });

    test('Set and get phone', () => {
        GlobalUser.set({ email: "awesome@kate.com", phone: "001225" });
        expect(GlobalUser.get()?.["phone"]).toBe("001225");
    });

    test('Get after clearing should return undefined', () => {
        GlobalUser.set({ email: "awesome@kate.com", phone: "001225" });
        GlobalUser.clear();
        expect(GlobalUser.get()).toBeUndefined();
    });
});
