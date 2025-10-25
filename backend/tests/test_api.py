import requests
import json

BASE_URL = "http://localhost:8000"  # Changed back to 8000 since that's your main server

def test_api():
    print("🧪 Testing QuickPoll API...")
    
    # 1. Create a poll
    poll_data = {
        "question": "What's your favorite programming language?",
        "options": ["Python", "JavaScript", "Java", "Go"],
        "creator_id": 1
    }
    
    try:
        response = requests.post(f"{BASE_URL}/polls/", json=poll_data)
        if response.status_code == 200:
            poll = response.json()
            poll_id = poll["id"]
            print(f"✅ Created poll: {poll['question']}")
            
            # 2. Vote on the poll
            vote_data = {"option": "Python", "user_id": 1}
            vote_response = requests.post(f"{BASE_URL}/polls/{poll_id}/vote", json=vote_data)
            if vote_response.status_code == 200:
                print("✅ Vote recorded successfully")
            
            # 3. Like the poll
            like_response = requests.post(f"{BASE_URL}/polls/{poll_id}/like")
            if like_response.status_code == 200:
                print("✅ Poll liked successfully")
            
            # 4. Get poll results
            results_response = requests.get(f"{BASE_URL}/polls/{poll_id}/results")
            if results_response.status_code == 200:
                results = results_response.json()
                print(f"✅ Poll results: {results['results']}")
            
            # 5. Get all polls
            polls_response = requests.get(f"{BASE_URL}/polls/")
            if polls_response.status_code == 200:
                polls = polls_response.json()
                print(f"✅ Total polls: {len(polls)}")
        else:
            print(f"❌ Failed to create poll: {response.status_code}")
    
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the server is running on port 8000")
        print("   Run: poetry run python main.py")
        return
    
    print("🎉 API testing complete!")

if __name__ == "__main__":
    test_api()
