const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const cache=new Map();function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module,exports:module.exports,require:n=>{if(n.startsWith('.')||n.startsWith('@/')){const base=n.startsWith('@/')?path.resolve(n.slice(2)):path.resolve(path.dirname(file),n);return load(base+(fs.existsSync(base+'.ts')?'.ts':'.tsx'));}if(n==='next/link')return {__esModule:true,default:props=>React.createElement('a',props,props.children)};return require(n);},Intl,Date,console});return module.exports;}

const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const Card=load('components/features/AceProductCard.tsx').default,data=load('lib/mock-data.ts');
const p={numPeople:2,numCompanions:1,goal:'relax',budget:30000000,diet:'Vợ ăn chay',quizAnswers:[]};
function render(preferences=p,packageId='sbu3'){const tour=data.tours.find(t=>t.packageId===packageId);return renderToStaticMarkup(React.createElement(Card,{packageId,preferences,selection:{packageId,departureCode:tour.departureSchedules[1].code},entryId:'chat test',onNavigate:()=>{},onChoose:()=>{}}));}
const html=render(),fold=html.indexOf('<details');
assert.ok(html.includes('Sportcation Premium'));assert.ok(html.includes('Vì sao phù hợp &amp; quyền lợi'));assert.ok(html.includes('Lịch trình theo ngày'));assert.ok(html.includes('Vợ ăn chay'));assert.ok(html.includes('Tổng giá cơ bản tham khảo'));assert.ok(html.indexOf('Yêu cầu ăn uống cần đơn vị tổ chức xác nhận')<fold);
assert.ok(html.indexOf('Gửi yêu cầu')<fold);assert.ok(html.includes('from=ace'));assert.ok(html.includes('consultation=chat%20test'));assert.ok(html.includes(encodeURIComponent(data.tours.find(t=>t.packageId==='sbu3').departureSchedules[1].code)));
const over=render({...p,budget:7000000});assert.ok(over.indexOf('Lịch này vượt ngân sách')<over.indexOf('<details'));
const blocked=render({...p,numPeople:20});assert.ok(blocked.includes('vượt quy mô 16'));assert.ok(blocked.indexOf('vượt quy mô 16')<blocked.indexOf('<details'));assert.ok(!blocked.includes('/booking?'));assert.ok(blocked.includes('/tours/sbu3?'));
const club=render({...p,numPeople:8,numCompanions:0,goal:'compete',budget:15000000},'sbu2');assert.ok(club.includes('Báo giá đoàn'));assert.ok(club.includes('/booking?'));
const solo=render({...p,numPeople:1,numCompanions:0},'sbu2');assert.ok(!solo.includes('/booking?'));assert.ok(solo.includes('ít nhất 8 khách'));
console.log('Passed: compact card preserves selected schedule/booking source, expandable evidence/itinerary, visible budget/diet warnings and capacity/minimum-party blocks.');
