const admin = require('firebase-admin');

// Pointing to the file relative to where migrate.ts now sits
const dataModule = require('./src/lib/menu-data.ts');
const items = dataModule.menuItems || dataModule.default || dataModule;

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function upload() {
  console.log("🚀 Starting Sync for Swiss Delights...");
  
  if (!Array.isArray(items)) {
    console.error("❌ Error: menuItems is not an array. Check your data file.");
    return;
  }

  console.log("📦 Found " + items.length + " items. Pushing to 'menu_items' collection...");
  const colRef = db.collection('menu_items');

  for (const item of items) {
    try {
      const { id, ...data } = item; // Remove local ID
      await colRef.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log("✅ Added: " + item.name);
    } catch (err) {
      console.error("❌ Failed adding " + item.name, err);
    }
  }
  console.log("\n✨ Done! Your menu is live.");
}

upload();
