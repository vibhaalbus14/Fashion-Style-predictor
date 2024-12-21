from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from fastapi import APIRouter
from typing import List
import time

router = APIRouter()

# Function to open a new tab and search dresses based on predicted color, gender, and category (top/bottom)
@router.get("/selenium_search")
def search_dresses(predicted_color: List[str], gender: str, category: str):
    # Set up Chrome options (you can add other options such as headless, etc.)
    options = Options()
    # options.add_argument("--headless")  # Optional: Remove this to allow the browser to show
    options.add_argument("--disable-gpu")  # Disable GPU acceleration
    options.add_argument("--no-sandbox")  # Disable sandboxing for some environments (e.g., Docker)

    # Set up the ChromeDriver service
    service = Service(ChromeDriverManager().install())

    driver = None
    try:
        # Create WebDriver instance with the service and options
        driver = webdriver.Chrome(service=service, options=options)

        # Open a new tab in the browser
        driver.execute_script("window.open('');")  # Open a new blank tab
        driver.switch_to.window(driver.window_handles[-1])  # Switch to the new tab

        # Open the website in the new tab
        driver.get("https://www.google.com")

        # Wait for the page to load
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "q")))  # Wait until the search box is located

        # Locate the search box on Google's homepage
        search_box = driver.find_element(By.NAME, 'q')  # Google's search box uses the name 'q'
        search_box.clear()

        stringColors=" ".join(predicted_color)

        # Create the search query based on predicted parameters
        query = f"{stringColors} {gender} {category}"

        # Enter the search query into the search box
        search_box.send_keys(query)

        # Press ENTER to search
        search_box.send_keys(Keys.RETURN)

        # Wait for search results to load
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, 'search')))  # Wait until the search results are displayed

        time.sleep(60)
        # At this point, the user will see the page in the new tab and the browser will remain open

    except Exception as e:
        print(f"An error occurred: {e}")
    # Do not quit the driver to leave the page open