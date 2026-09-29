const ts=require('typescript'),fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const place={place_id:'g-test',formatted_address:'12 Jalan Test, Kuala Lumpur',address_components:[{long_name:'12',types:['street_number']},{long_name:'Jalan Test',types:['route']},{long_name:'Kuala Lumpur',types:['locality']},{long_name:'50000',types:['postal_code']}],geometry:{location:{lat:()=>3.15,lng:()=>101.71}}};
const calls=[];let status='ok';
const code=ts.transpileModule(fs.readFileSync('src/services/geocoding.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const sandbox={exports:{},require:()=>({loadGoogleMaps:async()=>({Geocoder:class{async geocode(request){calls.push(request);if(status!=='ok')throw Error(status);return {results:[place]};}}})})};
vm.runInNewContext(code,sandbox);
(async()=>{const api=sandbox.exports;
assert.equal(api.validPoint({latitude:0,longitude:0}),true);
assert.equal(api.validPoint({latitude:3,longitude:181}),false);
const mapped=api.placeToAddress(place);assert.equal(mapped.city,'Kuala Lumpur');assert.equal(mapped.addressLine1,'12, Jalan Test');assert.equal(mapped.postcode,'50000');
await assert.rejects(()=>api.searchAddresses('a'));
assert.equal((await api.searchAddresses('KLCC')).length,1);assert.equal(calls[0].componentRestrictions.country,'MY');
const reverse=await api.reverseAddress({latitude:3.151234,longitude:101.712345});assert.equal(reverse.latitude,3.151234);assert.equal(reverse.longitude,101.712345);
status='ZERO_RESULTS';assert.equal((await api.searchAddresses('missing')).length,0);
status='REQUEST_DENIED';await assert.rejects(()=>api.searchAddresses('KLCC'),/Google/);
console.log('Google map adapter tests passed: address mapping, Malaysia restriction, exact pin preservation, empty results and failures.');
})().catch(e=>{console.error(e);process.exitCode=1;});

