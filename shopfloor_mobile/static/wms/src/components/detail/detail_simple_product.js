/**
 * Copyright 2020 Akretion (http://www.akretion.com)
 * @author Francois Poizat <francois.poizat@gmail.com>
 * License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
 */

import {ItemDetailMixin} from "./detail_mixin.js";

Vue.component("detail-simple-product", {
    props: ['product', 'fields', 'selected'],
    mixins: [ItemDetailMixin],
    methods: {
        line_color: function(line) {
            if (line.done) {
                return this.utils.colors.color_for('pack_line_done');
            }
            if (this.selected) {
                return this.utils.colors.color_for('pack_line_selected');
            }
            return undefined;
        },
    },
    template: `
    <v-row>
        <item-detail-card
            :record="product"
            :options="{fields: fields}"
            :card_color="line_color(product)"
        />
    </v-row>
    `,
});