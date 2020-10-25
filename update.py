import peewee
import psycopg2

import sys
import config

print('Arguments:', len(sys.argv))
print('sutff:', sys.argv)
print('update in progress')

sslvalue='require'

db = connect(os.environ.get('DEV_DB_URL') or Config.DATABASE_URL, sslmode=sslvalue)
print(db)