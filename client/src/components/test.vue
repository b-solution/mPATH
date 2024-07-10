<template>
    <input v-model="value" @input="onInput" />
</template>

<script>
export default {
    props: ['record', 'property', 'onChange'],
    data() {
        return {
            value: this.record.params[this.property.name] || '',
        };
    },
    methods: {
        onInput(event) {
            this.onChange(this.property.name, event.target.value);
        },
    },
};
</script>