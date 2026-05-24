const fs = require('fs');
const { MongoClient } = require('mongodb');

const DB_URL = 'mongodb+srv://olusmain_db_user:PrV5IZ5bIw77ES7L@cluster0.hu69dvn.mongodb.net/?appName=Cluster0';
const DB_NAME = 'output';
const DB_COLLECTION = 'stats';

const DAY_START = new Date('2026-05-09T00:00:00.000Z');
const DAY_END   = new Date('2026-05-10T00:00:00.000Z');

(async () => {
  const client = new MongoClient(DB_URL);
  await client.connect();
  const col = client.db(DB_NAME).collection(DB_COLLECTION);

  // createdAt wird als ISO-String gespeichert -> lexikalischer Vergleich funktioniert
  const filter = { createdAt: { $gte: DAY_START.toISOString(), $lt: DAY_END.toISOString() } };

  const toDelete = await col.find(filter).toArray();
  console.log(`Gefunden: ${toDelete.length} Dokumente am 2026-05-09`);
  for (const d of toDelete) {
    console.log(`  ${d._id}  ${d.createdAt}  ${d.milieuName}  ${d.email ?? '(anonym)'}`);
  }

  if (toDelete.length === 0) { await client.close(); return; }

  fs.writeFileSync('deleted-2026-05-09.backup.json', JSON.stringify(toDelete, null, 2), 'utf8');
  console.log('Backup geschrieben: deleted-2026-05-09.backup.json');

  const res = await col.deleteMany(filter);
  console.log(`Geloescht: ${res.deletedCount}`);

  await client.close();
})().catch(e => { console.error(e); process.exit(1); });
