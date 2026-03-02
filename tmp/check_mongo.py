import pymongo
import sys

uri = "mongodb+srv://kuldeepmaurya4296_db_user:BxzV03AVHvsWOcTw@cluster0.rgfx4lu.mongodb.net/leadharvest?appName=Cluster0"
try:
    client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=5000)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    sys.exit(1)
