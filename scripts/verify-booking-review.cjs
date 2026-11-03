const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
function compile(file,resolve=require){const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,{exports:mod.exports,module:mod,require:resolve});return mod.exports;}
const data=compile('lib/mock-data.ts'),pricing=compile('lib/couple-pricing.ts');let booking;
const Step=compile('components/features/BookingStep4.tsx',id=>id==='@/lib/mock-data'?data:id==='@/lib/couple-pricing'?pricing:id==='@/lib/BookingContext'?{useBooking:()=>({booking,updateBooking(){},setStep(){}})}:id==='@/lib/request-error'?{requestErrorMessage:String}:['./BookingDeposit','./BookingAccess','@/components/ui/Button'].includes(id)?{__esModule:true,default:()=>null,BookingLogin:()=>null}:require(id)).default;
const t=data.tours.find(t=>t.packageId==='sbu1'),schedule=t.departureSchedules[0];
for(const [people,companions] of [[1,0],[2,1],[3,0],[3,2]]){
 booking={packageId:'sbu1',tourId:t.id,departureCode:schedule.code,numPeople:people,numCompanions:companions,name:'QA',phone:'0901234567',email:'qa@example.com'};
 const html=renderToStaticMarkup(React.createElement(Step,{onConfirm(){}}));
 const total=pricing.coupleTotal('sbu1',schedule.price,people,companions);
 assert(html.includes(data.formatVND(total)));assert(!html.includes('× 0'));
 assert.equal(html.includes('người đi cùng ×'),companions>0);
 assert(html.includes(`${people-companions} người chơi ×`));
 assert(html.includes('booking-price-amount'));
}
assert.equal(pricing.coupleTotal('sbu1',6900000,1,0),6900000);
assert.equal(pricing.coupleTotal('sbu1',6900000,2,1),12300000);
console.log('PASS booking review: total matches line items, zero companion row hidden, single/couple/group counts.');
