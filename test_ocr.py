import easyocr
import sys
import os

def test_ocr():
    image_path = 'backend/temp_image.jpg'
    if not os.path.exists(image_path):
        print(f"Error: {image_path} does not exist.")
        return

    print("Initializing EasyOCR reader...")
    try:
        reader = easyocr.Reader(['en'], gpu=False)
        print("Reading text from image...")
        result = reader.readtext(image_path, detail=0)
        print("Result:", result)
    except Exception as e:
        print(f"Error during OCR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ocr()
