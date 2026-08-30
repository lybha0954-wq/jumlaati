import RetailerCartContent from './components/RetailerCartContent';

export default function Page() {
  return <RetailerCartContent />;
}
// داخل صفحة السلة
const [discount, setDiscount] = useState(0);
const [finalTotal, setFinalTotal] = useState(orderTotal);
const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);

const handleCouponApplied = (disc: number, total: number, couponId: string) => {
  setDiscount(disc);
  setFinalTotal(total);
  setAppliedCouponId(couponId);
};

const handleCouponRemoved = () => {
  setDiscount(0);
  setFinalTotal(orderTotal);
  setAppliedCouponId(null);
};

// ... في مكان عرض الإجمالي
<div className="flex justify-between border-b py-3">
  <span>المجموع الفرعي</span>
  <span>{orderTotal.toFixed(2)} ريال</span>
</div>
{discount > 0 && (
  <div className="flex justify-between border-b py-3 text-green-600">
    <span>الخصم</span>
    <span>- {discount.toFixed(2)} ريال</span>
  </div>
)}
<div className="flex justify-between text-xl font-bold py-3">
  <span>الإجمالي النهائي</span>
  <span>{finalTotal.toFixed(2)} ريال</span>
</div>

// مكون الكوبون
<CouponInput 
  orderTotal={orderTotal} 
  onCouponApplied={handleCouponApplied} 
  onCouponRemoved={handleCouponRemoved} 
/>

// عند إنشاء الطلب، مرر الكود والمبلغ المعدل
<CheckoutButton 
  orderTotal={finalTotal} 
  discount={discount} 
  couponId={appliedCouponId} 
/>
