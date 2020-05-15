import {ItemDetailMixin} from "./detail/detail_mixin.js";

/* eslint-disable strict */
Vue.component("list", {
    // TODO: move most of this stuff to a mixin and reuse it in manual-select
    props: {
        records: {
            type: Array,
            default: function() {
                return [];
            },
        },
        grouped_records: {
            type: Array,
            default: function() {
                return [];
            },
        },
        key_title: {
            type: String,
        },
        options: {
            type: Object,
        },
        list_item_fields: {
            type: Array,
            default: function() {
                return [];
            },
        },
    },
    computed: {
        has_records() {
            return this.records.length > 0;
        },
        listable() {
            if (!this.grouped_records.length) {
                // Simulate grouping (allows to keep template the same)
                return [{key: "no-group", title: "", records: this.records}];
            }
            return this.grouped_records;
        },
        opts() {
            // Defining defaults for an Object property
            // works only if you don't pass the property at all.
            // If you pass only one key, you'll lose all defaults.
            const opts = _.defaults({}, this.$props.options, {
                showCounters: false,
                key_title: "name",
                list_item_component: "list-item",
                list_item_action_component: null,
                list_item_on_click: null,
                list_item_options: {},
            });
            return opts;
        },
        list_item_options() {
            const opts = _.defaults({}, this.opts.list_item_options, {
                key_title: this.opts.key_title,
                showCounters: this.opts.showCounters,
                // customize fields
                fields: this.opts.list_item_fields,
            });
            return opts;
        },
        klass() {
            const bits = ["list"];
            _.forEach(this.opts, function(v, k) {
                if (v) {
                    let bit = "with-" + k;
                    if (typeof v === "string") {
                        bit += "--" + v;
                    }
                    bits.push(bit);
                }
            });
            return bits.join(" ");
        },
    },
    template: `
    <div :class="klass">
        <v-card outlined>
            <v-list v-if="has_records">
                <div class="list-group" v-for="group in listable" :key="group.key">
                    <v-card-title v-if="group.title">{{ group.title }}</v-card-title>
                    <div class="list-item-wrapper" v-for="(rec, index) in group.records"">
                        <v-list-item :key="index" @click="opts.list_item_on_click ? opts.list_item_on_click(rec) : undefined"
                                     :class="list_item_options.list_item_klass_maker ? list_item_options.list_item_klass_maker(rec) : ''">
                            <component
                                :is="opts.list_item_component"
                                :options="list_item_options"
                                :record="rec"
                                :index="index"
                                :count="group.records.length"
                                />
                        </v-list-item>
                    </div>
                </div>
            </v-list>
            <div class="no-record pa-2" v-if="!has_records">
                <p class="text--secondary">No item to list.</p>
            </div>
        </v-card>
    </div>
  `,
});

Vue.component("list-item", {
    mixins: [ItemDetailMixin],
    template: `
    <v-list-item-content>
        <v-list-item-title v-if="opts.key_title" v-text="_.result(record, opts.key_title)"></v-list-item-title>
        <div class="details">
            <div v-for="(field, index) in options.fields" :class="'field-detail ' + field.path.replace('.', '-') + ' ' + (field.klass || '')">
                <span v-if="raw_value(record, field) || field.display_no_value">
                    <span v-if="field.label" class="label">{{ field.label }}:</span> {{ render_field_value(record, field) }}
                </span>
                <v-btn icon class="detail-action"
                        v-if="has_detail_action(record, field)"
                        @click="on_detail_action(record, field, opts)">
                    <v-icon color="blue lighten-1">mdi-information</v-icon>
                </v-btn>
            </div>
        </div>
    </v-list-item-content>
  `,
});