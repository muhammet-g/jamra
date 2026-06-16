import Swal from 'sweetalert2';

const alertTheme = {
  background: '#181818',
  color: '#FFF8EF',
  confirmButtonColor: '#92000A',
  cancelButtonColor: '#4A0040',
};

export function showAddSuccess() {
  return Swal.fire({
    ...alertTheme,
    title: 'تمت الإضافة إلى الفاتورة',
    icon: 'success',
    timer: 1150,
    showConfirmButton: false,
    toast: true,
    position: 'top',
  });
}

export function confirmRemoveItem(itemName) {
  return Swal.fire({
    ...alertTheme,
    title: 'حذف من الفاتورة؟',
    text: `سيتم حذف ${itemName} من الفاتورة.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'إلغاء',
  });
}

export function confirmClearCart() {
  return Swal.fire({
    ...alertTheme,
    title: 'مسح الفاتورة بالكامل؟',
    text: 'سيتم حذف كل العناصر والخصومات الحالية.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، امسح',
    cancelButtonText: 'إلغاء',
  });
}
