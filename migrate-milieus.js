const { MongoClient } = require('mongodb');

const DB_URL = 'mongodb+srv://olusmain_db_user:PrV5IZ5bIw77ES7L@cluster0.hu69dvn.mongodb.net/?appName=Cluster0';
const DB_NAME = 'output';
const DB_COLLECTION = 'stats';

const DRY_RUN = process.argv.includes('--apply') ? false : true;

// Mapping: current milieuKey -> canonical (Sinus-Jugendmilieus)
const mapping = {
  // alte Namen (vor erstem Merge)
  konservativ_buergerlich: { milieuKey: 'traditionell_buergerlich', milieuName: 'Traditionell-Bürgerliche' },
  traditionell:            { milieuKey: 'traditionell_buergerlich', milieuName: 'Traditionell-Bürgerliche' },
  adaptiv_pragmatisch:     { milieuKey: 'adaptiv_pragmatisch',      milieuName: 'Adaptiv-Pragmatische' },
  sozialoekologisch:       { milieuKey: 'neo_oekologisch',          milieuName: 'Neo-Ökologische' },
  expeditiv:               { milieuKey: 'expeditiv',                milieuName: 'Expeditive' },
  konsum_hedonistisch:     { milieuKey: 'konsum_materialistisch',   milieuName: 'Konsum-Materialisten' },
  materialistisch_hedonistisch:     { milieuKey: 'konsum_materialistisch', milieuName: 'Konsum-Materialisten' },
  experimentalistisch_hedonistisch: { milieuKey: 'experimentalisten',      milieuName: 'Experimentalisten' },
  'prekär':                { milieuKey: 'prekaer',                  milieuName: 'Prekäre' },
  // bereits kanonisch (no-op)
  traditionell_buergerlich: { milieuKey: 'traditionell_buergerlich', milieuName: 'Traditionell-Bürgerliche' },
  adaptiv:                  { milieuKey: 'adaptiv_pragmatisch',     milieuName: 'Adaptiv-Pragmatische' },
  adaptiv_pragmatische:     { milieuKey: 'adaptiv_pragmatisch',     milieuName: 'Adaptiv-Pragmatische' },
  neo_oekologisch:          { milieuKey: 'neo_oekologisch',          milieuName: 'Neo-Ökologische' },
  konsum_materialistisch:   { milieuKey: 'konsum_materialistisch',   milieuName: 'Konsum-Materialisten' },
  experimentalisten:        { milieuKey: 'experimentalisten',        milieuName: 'Experimentalisten' },
  prekaer:                  { milieuKey: 'prekaer',                  milieuName: 'Prekäre' },
};

(async () => {
  const client = new MongoClient(DB_URL);
  await client.connect();
  const col = client.db(DB_NAME).collection(DB_COLLECTION);

  const docs = await col.find({}, { projection: { _id: 1, milieuKey: 1, milieuName: 1 } }).toArray();

  const changes = [];
  for (const d of docs) {
    const target = mapping[d.milieuKey];
    if (!target) { console.log(`SKIP (unmapped): ${d._id} key=${d.milieuKey}`); continue; }
    if (d.milieuKey !== target.milieuKey || d.milieuName !== target.milieuName) {
      changes.push({ _id: d._id, from: { k: d.milieuKey, n: d.milieuName }, to: target });
    }
  }

  console.log(`\nMode: ${DRY_RUN ? 'DRY-RUN' : 'APPLY'}`);
  console.log(`Gesamt: ${docs.length} Dokumente, ${changes.length} Updates noetig\n`);
  for (const c of changes) {
    console.log(`  ${c._id}  "${c.from.k}" / "${c.from.n}"  ->  "${c.to.milieuKey}" / "${c.to.milieuName}"`);
  }

  if (!DRY_RUN && changes.length) {
    console.log('\nSchreibe Updates...');
    for (const c of changes) {
      await col.updateOne({ _id: c._id }, { $set: c.to });
    }
    console.log(`${changes.length} Dokumente aktualisiert.`);
  } else if (DRY_RUN) {
    console.log('\n(Dry-Run — keine Aenderung. Mit --apply ausfuehren.)');
  }

  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
