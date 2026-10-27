import packages from '../../data/packages.json';

const slugs = ['elephant-nature', 'walk-and-feed', 'mini-elephant-nature', 'thai-cooking-and-bananas', 'exclusive-cooking-and-elephants'];
const durations = ['3 hours', '1.5 hours', '1.5 hours', '3.5–4.5 hours', '5–6 hours'];
// Existing catalogue only: prices, times and activities await operator approval.
export const tours = packages.map((tour, index) => ({
  ...tour, slug: slugs[index], duration: durations[index], verified: false,
}));
export type Tour = typeof tours[number];
export const catalogueNotice = {
  th: 'ราคา ระยะเวลา รอบเวลา และกิจกรรมด้านล่างเป็นข้อมูลเบื้องต้นที่ยังรอผู้ให้บริการยืนยัน ไม่ใช่ข้อเสนอขายหรือการรับประกันที่นั่ง โปรดรอยืนยันราคาเด็ก ช่วงอายุ สิ่งที่รวม/ไม่รวม และรถรับส่งก่อนตกลงจอง',
  en: 'Prices, durations, times and activities are provisional and await operator confirmation. They are not a sales offer or a guarantee of availability. Confirm child age bands, inclusions, exclusions and pickup before booking.',
};
