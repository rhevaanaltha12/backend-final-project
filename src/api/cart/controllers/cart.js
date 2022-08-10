"use strict";

/**
 *  cart controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart.cart", ({ strapi }) => ({
    async find(ctx) {
        // Get and set neccessary data
        const owner = ctx.state.user.id;
        ctx.request.query = {
            ...ctx.request.query,
            filters: {
                owner,
                is_checked_out: false,
            },
        };

        // Find original data
        let { data, meta } = await super.find(ctx);

        // Check if there is no cart yet
        if (data.length === 0) {
            // Create new cart
            await strapi.entityService.create("api::cart.cart", {
                data: {
                    owner,
                },
            });

            // Get cart
            const cart = await super.find(ctx);
            data = cart.data;
            meta = cart.meta;
        }

        await strapi.service("api::cart.cart").updateValues(data[0].id);

        return { data, meta };
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const userId = ctx.state.user.id;

        // Check ownership
        const isOwn = await strapi
            .service("api::cart.cart")
            .checkOwnership(id, userId);

        if (!isOwn) {
            return ctx.forbidden("You have no right to access this data");
        }

        // Delete attribute owner
        const { data, meta } = await super.findOne(ctx);

        return { data, meta };
    },
}));
