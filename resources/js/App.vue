<script setup>
import { theme } from 'ant-design-vue';
import mnMN from 'ant-design-vue/es/locale/mn_MN';
import dayjs from 'dayjs';
import 'dayjs/locale/mn';
dayjs.locale('mn');
useGoogleFonts()
</script>
<template>
    <a-config-provider :locale="mnMN" :theme="{
        algorithm: [theme.defaultAlgorithm, theme.compactAlgorithm],
        token: {
            fontFamily: 'Montserrat',
            colorPrimary: '#3b82f6',
            paddingContentVertical: 4,
        },
    }">
        <component :is="`${$route.meta.layout}`">
            <router-view />
        </component>
    </a-config-provider>
</template>