import os
import json
import unittest
from dotenv import load_dotenv
from flask_testing import TestCase
from supabase import create_client
from app import app  # Stelle sicher, dass dies der korrekte Importpfad zu deiner Flask-App ist


class TestAPI(TestCase):
    """Ein TestCase für die Flask-App mit Supabase Integration."""

    @classmethod
    def setUpClass(cls):
        """Lade Umgebungsvariablen und initialisiere Supabase Client."""
        load_dotenv()
        cls.SUPABASE_URL = os.getenv('SUPABASE_URL')
        cls.SUPABASE_KEY = os.getenv('SUPABASE_KEY')
        cls.supabase = create_client(cls.SUPABASE_URL, cls.SUPABASE_KEY)

    def create_app(self):
        """Konfiguriere die Flask-App für das Testing."""
        app.config['TESTING'] = True
        app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = False
        return app

    # def test_login_success(self):
    #     """Teste den Erfolg des Login-Vorgangs."""
    #     response = self.client.post('/api/auth/login', json={
    #         'email': 'yanik1999@hotmail.com',  # Ändere dies zu einem gültigen Test-Benutzer
    #         'password': '111111'  # Ändere dies zu einem gültigen Passwort
    #     })
    #
    #     self.assertEqual(response.status_code, 200)
    #     # set_cookie_header = response.headers.get('Set-Cookie')
    #     # self.assertIsNotNone(set_cookie_header)
    #     # self.assertIn('refresh_token', set_cookie_header)

    def test_get_posts_without_parameters(self):
        """Teste das Abrufen von Posts ohne Parameter."""
        response = self.client.get('/api/post/')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json['data']['posts'], list)

    def test_get_posts_with_uuid_filter(self):
        """Teste das Abrufen von Posts mit einem UUID-Filter."""
        user = self.supabase.table('users').select('id').limit(1).execute().data
        test_uuid = user[0]['id']
        response = self.client.get(f'/api/post/?uuid={test_uuid}')
        self.assertEqual(response.status_code, 200)
        for post in response.json['data']['posts']:
            self.assertEqual(post['user_id'], test_uuid)

    def test_get_posts_with_query_filter(self):
        """Teste das Abrufen von Posts mit einem Suchbegriff-Filter."""
        test_query = 'eggs'  # Beispiel-Suchbegriff, passe dies entsprechend an
        response = self.client.get(f'/api/post/?query={test_query}')
        self.assertEqual(response.status_code, 200)
        for post in response.json['data']['posts']:
            self.assertIn(test_query, post['post'].lower())

    def test_get_users_with_name_query(self):
        """Teste das Abrufen von Benutzern anhand eines Namens."""
        user = self.supabase.table('users').select('name').limit(1).execute().data
        test_name = user[0]['name']
        response = self.client.get(f'/api/user/?name={test_name}')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json['data']['users'], list)
        self.assertGreater(len(response.json['data']['users']), 0)

    def test_get_user_by_uuid(self):
        """Teste das Abrufen eines Benutzers anhand seiner UUID."""
        user = self.supabase.table('users').select('id').limit(1).execute().data
        test_uuid = user[0]['id']
        response = self.client.get(f'/api/user/{test_uuid}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('user', response.json['data'])
        self.assertEqual(response.json['data']['user']['id'], test_uuid)

    def test_get_user_by_uuid_with_user_details_only(self):
        """Teste das Abrufen von Benutzerdetails anhand der UUID, ohne Posts."""
        user = self.supabase.table('users').select('id').limit(1).execute().data
        test_uuid = user[0]['id']
        response = self.client.get(f'/api/user/{test_uuid}?UserDetailsOnly=true')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['data']['id'], test_uuid)
        self.assertNotIn('posts', response.json['data'])


if __name__ == '__main__':
    unittest.main()
