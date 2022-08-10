module.exports = {
    routes: [
        {
            method: "POST",
            path: "/carts/order",
            handler: "transaction.create",
        },

        {
            method: "POST",
            path: "/transactions/confirm",
            handler: "transaction.confirm",
        },

        {
            method: "POST",
            path: "/transactions/cancel",
            handler: "transaction.cancel",
        },
    ],
};
