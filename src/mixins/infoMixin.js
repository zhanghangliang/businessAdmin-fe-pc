
import { filterObj } from '@/utils/util';
import { deleteAction, getAction, downFile, httpAction } from '@/api/manage'
import Cookies from 'js-cookie'

export default {
    data() {
        return {
            member:''
        }
    },
    created() {
        this.member = JSON.parse(Cookies.get('member' + this.systemType))
        this.checkMobile()
    },
    methods: {
        checkMobile() {
            if (!this.member.mobile) {
                this.Dialog.alert({
                    title: '系统提示',
                    message: '请完善基础信息里的手机号码',
                }).then(() => {

                    this.$router.push({ path: '/baseInfo', query: { checkMobile: true } })
                });
            }
        },
    }
}