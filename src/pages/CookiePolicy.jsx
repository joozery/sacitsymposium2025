import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Shield, Settings, Eye, ExternalLink } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Prompt, sans-serif' }}>
      {/* Header */}
      <div className="py-16 mt-16" style={{ backgroundColor: '#bfb4ee' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับหน้าหลัก
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">นโยบายคุกกี้ (Cookies Policy)</h1>
              <p className="text-purple-100 text-lg">สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Section 1: นโยบายคุกกี้ */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. นโยบายคุกกี้</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                เมื่อท่านได้เข้าสู่เว็บไซต์ (member.sacit.or.th) ข้อมูลที่เกี่ยวข้องกับการเข้าสู่เว็บไซต์ของท่านจะถูกบันทึกไว้ในรูปแบบของคุกกี้ 
                โดยนโยบายคุกกี้นี้จะอธิบายถึงความหมาย การทำงาน วัตถุประสงค์ รวมถึงการลบและการปฏิเสธการเก็บคุกกี้ 
                เพื่อความเป็นส่วนตัวของท่านโดยการเข้าสู่เว็บไซต์นี้ถือว่าท่านได้อนุญาตให้เราใช้คุกกี้ตามนโยบายคุกกี้ที่มีรายละเอียดดังต่อไปนี้
              </p>
            </section>

            {/* Section 2: คุกกี้คืออะไร */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-600" />
                2. คุกกี้คืออะไร
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  คุกกี้ คือ ไฟล์เล็ก ๆ เพื่อจัดเก็บข้อมูลการเข้าใช้งานเว็บไซต์ เช่น วันเวลา ลิงก์ที่คลิก หน้าที่เข้าชม เงื่อนไขการตั้งค่าต่าง ๆ 
                  โดยจะบันทึกลงไปในอุปกรณ์คอมพิวเตอร์ และ/หรือ เครื่องมือสื่อสารที่เข้าใช้งานของท่าน เช่น โน๊ตบุ๊ค แท็บเล็ต หรือ สมาร์ทโฟน 
                  ผ่านทางเว็บเบราว์เซอร์ในขณะที่ท่านเข้าสู่เว็บไซต์ โดยคุกกี้จะไม่ก่อให้เกิดอันตรายต่ออุปกรณ์คอมพิวเตอร์ และ/หรือ เครื่องมือสื่อสารของท่าน
                </p>
                <p>
                  ในกรณีดังต่อไปนี้ข้อมูลส่วนบุคคลของท่านอาจถูกจัดเก็บเพื่อใช้เพิ่มประสบการณ์การใช้งานบริการทางออนไลน์ โดยจะจำเอกลักษณ์ของภาษา
                  และปรับแต่งข้อมูลการใช้งานตามความต้องการของท่าน เป็นการยืนยันคุณลักษณะเฉพาะตัว ข้อมูลความปลอดภัยของท่าน รวมถึงบริการที่ท่านสนใจ 
                  นอกจากนี้คุกกี้ยังถูกใช้เพื่อวัดปริมาณการเข้าใช้งานบริการทางออนไลน์การปรับเปลี่ยนเนื้อหาตามการใช้งานของท่านโดยพิจารณาจากพฤติกรรมการเข้าใช้งานครั้งก่อนๆ 
                  และ ณ ปัจจุบัน และอาจมีวัตถุประสงค์เพื่อการโฆษณาประชาสัมพันธ์
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm">
                    ทั้งนี้ท่านสามารถค้นหาข้อมูลเพิ่มเติมเกี่ยวกับคุกกี้ได้ที่{' '}
                    <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1">
                      www.allaboutcookies.org
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: สศท. ใช้คุกกี้อย่างไร */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <Settings className="w-6 h-6 text-purple-600" />
                3. สศท. ใช้คุกกี้อย่างไร
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  สศท. ใช้คุกกี้ เพื่อบันทึกการเข้าเยี่ยมชมและสมัครเข้าใช้งานเว็บไซต์ของท่าน โดยทำให้ สศท. สามารถจดจำการใช้งานเว็บไซต์ของท่านได้ง่ายขึ้น 
                  และข้อมูลเหล่านี้จะถูกนำไปเพื่อปรับปรุงเว็บไซต์ของ สศท.ให้ตรงกับความต้องการของท่านมากยิ่งขึ้น เพื่ออำนวยความสะดวกให้เกิดความรวดเร็วในการใช้งานเว็บไซต์ของท่าน 
                  และในบางกรณี สศท. จำเป็นต้องให้บุคคลที่สามช่วยดำเนินการดังกล่าว ซึ่งอาจจะต้องใช้ อินเตอร์เน็ตโปรโตคอลแอดเดรส (IP Address) และคุกกี้เพื่อวิเคราะห์ทางสถิติ 
                  ตลอดจนเชื่อมโยงข้อมูล และประมวลผลตามวัตถุประสงค์ทางการตลาด
                </p>
                
                <p className="font-semibold">คุกกี้ที่ สศท. ใช้แบ่งได้ 2 ประเภทตามการจัดเก็บ ดังนี้</p>
                
                <div className="grid gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Session Cookies</h3>
                    <p className="text-green-700 text-sm">
                      เป็นคุกกี้ที่จะอยู่ชั่วคราวเพื่อจดจำท่านในระหว่างที่ท่านเข้าเยี่ยมชมเว็บไซต์ของ สศท. เช่น เฝ้าติดตามภาษาที่ท่านได้ตั้งค่าและเลือกใช้ เป็นต้น 
                      และจะมีการลบออกจากเครื่องคอมพิวเตอร์หรืออุปกรณ์ของท่าน เมื่อท่านออกจากเว็บไซต์หรือได้ทำการปิดเว็บเบราว์เซอร์
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Persistent Cookie</h3>
                    <p className="text-blue-700 text-sm">
                      เป็นคุกกี้ที่จะอยู่ตามระยะเวลาที่กำหนดหรือจนกว่าท่านจะลบออกคุกกี้ประเภทนี้จะช่วยให้เว็บไซต์ของ สศท. จดจำท่านและการตั้งค่าต่าง ๆ ของท่าน
                      เมื่อท่านกลับมาใช้บริการเว็บไซต์อีกครั้งซึ่งจะช่วยให้ท่านเข้าใช้บริการเว็บไซต์ได้สะดวกรวดเร็วยิ่งขึ้น
                    </p>
                  </div>
                </div>

                <p className="font-semibold">วัตถุประสงค์ในการใช้งานคุกกี้ที่ สศท. ใช้ มีรายละเอียดดังนี้</p>
                
                <div className="grid gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">คุกกี้ที่มีความจำเป็น (Strictly Necessary Cookies)</h3>
                    <p className="text-red-700 text-sm">
                      คุกกี้ประเภทนี้มีความจำเป็นต่อการให้บริการเว็บไซต์ของ สศท. เพื่อให้ท่านสามารถเข้าใช้งานในส่วนต่าง ๆ ของเว็บไซต์ได้ 
                      รวมถึงช่วยจดจำข้อมูลที่ท่านเคยให้ไว้ผ่านเว็บไซต์การปิดการใช้งานคุกกี้ประเภทนี้จะส่งผลให้ท่านไม่สามารถใช้บริการในสาระสำคัญของ สศท. 
                      ซึ่งจำเป็นต้องเรียกใช้คุกกี้ได้
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">คุกกี้เพื่อการวิเคราะห์และประเมินผลการใช้งาน (Performance Cookies)</h3>
                    <p className="text-purple-700 text-sm">
                      คุกกี้ประเภทนี้ช่วยให้ สศท. ทราบถึงการปฏิสัมพันธ์ของผู้ใช้งานในการใช้บริการเว็บไซต์ของ สศท. รวมถึงหน้าเพจหรือพื้นที่ใดของเว็บไซต์ที่ได้รับความนิยม 
                      ตลอดจนการวิเคราะห์ข้อมูลด้านอื่น ๆ สศท. ยังใช้ข้อมูลนี้เพื่อการปรับปรุงการทำงานของเว็บไซต์ และเพื่อเข้าใจพฤติกรรมของผู้ใช้งานมากขึ้น 
                      ถึงแม้ว่า ข้อมูลที่คุกกี้นี้เก็บรวบรวมจะเป็นข้อมูลที่ไม่สามารถระบุตัวตนได้ และนำมาใช้วิเคราะห์ทางสถิติเท่านั้นการปิดการใช้งานคุกกี้ประเภทนี้จะส่งผลให้ 
                      สศท. ไม่สามารถทราบปริมาณผู้เข้าเยี่ยมชมเว็บไซต์และไม่สามารถประเมินคุณภาพการให้บริการได้
                    </p>
                  </div>
                </div>

                {/* Cookie Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left font-semibold">ประเภทของคุกกี้</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">รายละเอียด</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">ตัวอย่าง</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3 font-semibold text-red-700">คุกกี้ที่มีความจำเป็น<br/>(Strictly Necessary Cookies)</td>
                        <td className="border border-gray-300 p-3 text-sm">
                          คุกกี้ประเภทนี้มีความจำเป็นต่อการให้บริการเว็บไซต์ของ สศท. เพื่อให้ท่านสามารถเข้าใช้งานในส่วนต่าง ๆ ของเว็บไซต์ได้ 
                          รวมถึงช่วยจดจำข้อมูลที่ท่านเคยให้ไว้ผ่านเว็บไซต์การปิดการใช้งานคุกกี้ประเภทนี้จะส่งผลให้ท่านไม่สามารถใช้บริการในสาระสำคัญของ สศท. 
                          ซึ่งจำเป็นต้องเรียกใช้คุกกี้ได้
                        </td>
                        <td className="border border-gray-300 p-3 text-sm">
                          PHPSESSID<br/>
                          JSESSIONID
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-semibold text-purple-700">คุกกี้เพื่อการวิเคราะห์<br/>และประเมินผลการใช้งาน<br/>(Performance Cookies)</td>
                        <td className="border border-gray-300 p-3 text-sm">
                          คุกกี้ประเภทนี้ช่วยให้ สศท. ทราบถึงการปฏิสัมพันธ์ของผู้ใช้งานในการใช้บริการเว็บไซต์ของ สศท. รวมถึงหน้าเพจหรือพื้นที่ใดของเว็บไซต์ที่ได้รับความนิยม 
                          ตลอดจนการวิเคราะห์ข้อมูลด้านอื่น ๆ สศท. ยังใช้ข้อมูลนี้เพื่อการปรับปรุงการทำงานของเว็บไซต์ และเพื่อเข้าใจพฤติกรรมของผู้ใช้งานมากขึ้น 
                          ถึงแม้ว่า ข้อมูลที่คุกกี้นี้เก็บรวบรวมจะเป็นข้อมูลที่ไม่สามารถระบุตัวตนได้ และนำมาใช้วิเคราะห์ทางสถิติเท่านั้นการปิดการใช้งานคุกกี้ประเภทนี้จะส่งผลให้ 
                          สศท. ไม่สามารถทราบปริมาณผู้เข้าเยี่ยมชมเว็บไซต์และไม่สามารถประเมินคุณภาพการให้บริการได้
                        </td>
                        <td className="border border-gray-300 p-3 text-sm">
                          __utmc<br/>
                          _hjIncludedInPageviewSample<br/>
                          _hjTLDTest<br/>
                          _gid<br/>
                          __utma<br/>
                          __utmb<br/>
                          __utmt<br/>
                          __utmz<br/>
                          _hjid<br/>
                          _ga<br/>
                          _hjAbsoluteSessionInProgress<br/>
                          _hjFirstSeen
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 4: การจัดการคุกกี้ */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-purple-600" />
                4. ท่านจะจัดการคุกกี้ได้อย่างไร
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  บราวเซอร์ส่วนใหญ่จะมีการตั้งค่าให้มีการยอมรับคุกกี้เป็นค่าเริ่มต้น อย่างไรก็ตามท่านสามารถปฏิเสธการใช้งานหรือลบคุกกี้ในหน้าการตั้งค่าของบราวเซอร์ที่ท่านใช้งานอยู่ 
                  ทั้งนี้ หากท่านทำการปรับเปลี่ยนการตั้งค่าบราวเซอร์ของท่านอาจส่งผลกระทบต่อรูปแบบและการใช้งานบนหน้าเว็บไซต์ของเราได้ 
                  หากท่านประสงค์ที่จะทำการปรับเปลี่ยนการตั้งค่า ท่านสามารถตรวจสอบรายละเอียดเพิ่มเติมได้ตามลิงก์ที่ได้ระบุไว้ข้างล่าง
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">Android (Chrome)</div>
                  <div className="bg-gray-50 p-3 rounded-lg">Apple Safari</div>
                  <div className="bg-gray-50 p-3 rounded-lg">Google Chrome</div>
                  <div className="bg-gray-50 p-3 rounded-lg">Microsoft Edge</div>
                  <div className="bg-gray-50 p-3 rounded-lg">Microsoft Internet Explorer</div>
                  <div className="bg-gray-50 p-3 rounded-lg">Mozilla Firefox</div>
                  <div className="bg-gray-50 p-3 rounded-lg">Opera</div>
                  <div className="bg-gray-50 p-3 rounded-lg">Iphone or Ipad (Chrome)</div>
                  <div className="bg-gray-50 p-3 rounded-lg">Iphone or Ipad (Safari)</div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm">
                    ทั้งนี้ โปรดทราบว่า หากท่านเลือกที่จะปิดการใช้งานคุกกี้บนเบราว์เซอร์หรืออุปกรณ์ของท่าน อาจส่งผลกระทบกับการทำงานบางส่วนของเว็บไซต์ของ สศท. 
                    ที่ไม่สามารถทำงานหรือให้บริการได้เป็นปกติ สศท. จะไม่รับผิดชอบและ สศท. ไม่ได้มีความเกี่ยวข้องกับเว็บไซต์ รวมทั้งเนื้อหาในเว็บไซต์ต่าง ๆ ที่กล่าวมาข้างบน
                  </p>
                  <p className="text-amber-800 text-sm mt-2">
                    สำหรับข้อมูลอื่น ๆ เพิ่มเติมในเรื่องนี้ ท่านสามารถเข้าไปอ่านได้ที่{' '}
                    <a href="https://www.aboutcookies.org/how-to-manage-and-delete-cookies" target="_blank" rel="noopener noreferrer" 
                       className="text-amber-600 hover:text-amber-800 underline inline-flex items-center gap-1">
                      https://www.aboutcookies.org/how-to-manage-and-delete-cookies
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: การเชื่อมโยงข้อมูลกับเว็บไซต์อื่น */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. การเชื่อมโยงข้อมูลกับเว็บไซต์อื่น</h2>
              <p className="text-gray-700 leading-relaxed">
                เว็บไซต์ของ สศท. อาจมีการเชื่อมโยงไปยังเว็บไซต์หรือโซเชียลมีเดียของบุคคลภายนอก รวมถึงอาจมีการฝังเนื้อหาหรือวีดีโอที่มาจากโซเชียลมีเดีย เช่น YouTube หรือ Facebook เป็นต้น 
                ซึ่งจะช่วยให้ท่านเข้าถึงเนื้อหาและสร้างการปฏิสัมพันธ์กับบุคคลอื่นบนโซเชียลมีเดียจากเว็บไซต์ของ สศท. ได้ ซึ่งเว็บไซต์หรือโซเชียลมีเดียของบุคคลภายนอกจะมีการกำหนดและตั้งค่าคุกกี้ขึ้นมาเอง 
                โดยที่ สศท. ไม่สามารถควบคุมหรือรับผิดชอบต่อคุกกี้เหล่านั้นได้ และขอแนะนำให้ท่านควรเข้าไปอ่านและศึกษานโยบายหรือประกาศการใช้คุกกี้ของบุคคลภายนอกเหล่านั้นด้วย
              </p>
            </section>

            {/* Section 6: การเปลี่ยนแปลงประกาศ */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. การเปลี่ยนแปลงประกาศ</h2>
              <p className="text-gray-700 leading-relaxed">
                ประกาศนี้อาจมีการปรับปรุงให้เหมาะสมและสอดคล้องกับสถานการณ์และตามการให้บริการจริง โดย สศท. จะมีการแจ้งประกาศที่มีการปรับปรุงใหม่บนเว็บไซต์นี้ 
                ดังนั้น สศท. ขอแนะนำให้ท่านตรวจสอบให้แน่ใจว่าท่านได้เข้าใจการเปลี่ยนแปลงตามข้อกำหนดดังกล่าว
              </p>
            </section>

            {/* Section 7: ติดต่อ สศท. */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. ติดต่อ สศท.</h2>
              <p className="text-gray-700 mb-4">
                ในกรณีที่ท่านมีคำถามเกี่ยวกับนโยบายคุกกี้ของเรา ท่านสามารถติดต่อสอบถามได้ที่
              </p>
              <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-gray-700">
                <p><strong>เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (Data Protection Officer : DPO)</strong></p>
                <p><strong>สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน)</strong></p>
                <p><strong>สถานที่ติดต่อ:</strong> 59 หมู่ 4 ต.ช้างใหญ่ อ.บางไทร จ.พระนครศรีอยุธยา 13290</p>
                <p><strong>ช่องทางการติดต่อ:</strong> sacit.pdpa@sacit.or.th</p>
                <p><strong>Call Center:</strong> 035-367054-9</p>
              </div>
            </section>

            {/* Last Updated */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-500 text-sm">
                ประกาศ ณ วันที่ เดือนพฤษภาคม พ.ศ.2565
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 