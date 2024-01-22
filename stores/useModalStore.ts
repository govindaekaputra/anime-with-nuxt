import { ModalType } from "~/types/modal_type";
import { USE_MODAL_STORE } from "~/utils/constant";

export const useModalStore = defineStore(USE_MODAL_STORE, {
  state: () => ({
    isShow: false,
    type: ModalType.unknown,
  }),
  actions: {
    showModal(props: { type: ModalType }) {
      this.isShow = true;
      this.type = props.type;
    },
    closeModal() {
      this.isShow = false;
    },
  },
});
