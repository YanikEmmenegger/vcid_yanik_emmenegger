import os
import unittest

from dotenv import load_dotenv
from flask_testing import TestCase
from supabase import create_client, Client
from app import app  # Importiere deine Flask-App
import json


class TestAPI(TestCase):
    load_dotenv()

    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    def create_app(self):
        # Konfiguriere deine App für das Testing
        app.config['TESTING'] = True
        return app

    def test_login_success(self):
        response = self.client.post('/api/auth/login', data=json.dumps({
            'email': 'yanik1999@hotmail.com',
            'password': '111111'
        }), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        set_cookie_header = response.headers.get('Set-Cookie')
        self.assertIsNotNone(set_cookie_header)
        self.assertIn('refresh_token', set_cookie_header)

    def test_get_posts_without_parameters(self):
        response = self.client.get('/api/post/')
        self.assertEqual(response.status_code, 200)
        # Prüfe, ob die Antwort ein JSON-Objekt mit einer Liste von Posts enthält
        self.assertIsInstance(response.json['data']['posts'], list)

    def test_get_posts_with_uuid_filter(self):
        # hole eine existierende UUID aus der Datenbank
        user = self.supabase.table('users').select('id').limit(1).execute().data
        test_uuid = user[0]['id']
        response = self.client.get(f'/api/post/?uuid={test_uuid}')
        self.assertEqual(response.status_code, 200)
        # prüfe, ob die zurückgegebenen Posts alle vom User mit der UUID test_uuid sind
        for post in response.json['data']['posts']:
            self.assertEqual(post['user_id'], test_uuid)

    def test_get_posts_with_query_filter(self):
        test_query = 'eggs'
        response = self.client.get(f'/api/post/?query={test_query}')
        self.assertEqual(response.status_code, 200)
        # prüfe, ob die zurückgegebenen Posts alle den Suchbegriff test_query enthalten
        for post in response.json['data']['posts']:
            self.assertIn(test_query, post['post'].lower())

    def test_get_users_with_name_query(self):
        # hole eine existierende UUID aus der Datenbank
        user = self.supabase.table('users').select('name').limit(1).execute().data
        test_name = user[0]['name']
        response = self.client.get(f'/api/user/?name={test_name}')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json['data']['users'], list)
        self.assertGreater(len(response.json['data']['users']), 0)

    def test_get_user_by_uuid(self):
        # hole eine existierende UUID aus der Datenbank
        user = self.supabase.table('users').select('id').limit(1).execute().data
        test_uuid = user[0]['id']
        response = self.client.get(f'/api/user/{test_uuid}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('user', response.json['data'])
        self.assertEqual(response.json['data']['user']['id'], test_uuid)

    def test_get_user_by_uuid_with_user_details_only(self):
        # hole eine existierende UUID aus der Datenbank
        user = self.supabase.table('users').select('id').limit(1).execute().data
        test_uuid = user[0]['id']
        response = self.client.get(f'/api/user/{test_uuid}?UserDetailsOnly=true')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['data']['id'], test_uuid)
        # Überprüfe, ob nur Nutzerdetails ohne Posts zurückgegeben werden
        self.assertNotIn('posts', response.json['data'])


if __name__ == '__main__':
    unittest.main()
