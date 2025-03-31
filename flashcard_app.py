import csv
import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import os
import glob
import random

class FlashCardApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Finnish-English Flash Cards")
        
        self.cards = []
        self.current_card = 0
        self.is_front = True
        
        # Load data from CSV with UTF-8 encoding
        with open('suomi_englanti.csv', 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 2:  # Add validation check
                    finnish, english = row[0], row[1]
                    image_path = self.find_image(english)
                    if image_path:
                        self.cards.append({
                            'finnish': finnish,
                            'english': english,
                            'image': image_path
                        })
        
        random.shuffle(self.cards)
        
        # Create GUI elements with adjusted positions
        self.canvas = tk.Canvas(root, width=600, height=450)  # Increased height
        self.canvas.pack(pady=20)
        
        # Adjust positions to prevent overlap
        self.image_container = self.canvas.create_image(300, 150)
        self.text_container = self.canvas.create_text(300, 350,  # Lower position
                                                    text="", 
                                                    font=('Arial', 24),  # Changed font
                                                    width=550)  # Text wrapping
        
        btn_frame = ttk.Frame(root)
        btn_frame.pack(pady=20)
        
        self.flip_btn = ttk.Button(btn_frame, text="Flip Card", command=self.flip_card)
        self.flip_btn.pack(side=tk.LEFT, padx=10)
        
        self.next_btn = ttk.Button(btn_frame, text="Next Card", command=self.next_card)
        self.next_btn.pack(side=tk.LEFT)
        
        self.show_card()
    
    def find_image(self, english_word):
        # Improved filename cleaning
        clean_word = english_word.lower().replace(' ', '_').replace("'", "")
        search_pattern = f"images/*{clean_word}*"
        images = glob.glob(search_pattern)
        return images[0] if images else None
    
    def show_card(self):
        card = self.cards[self.current_card]
        
        try:
            img = Image.open(card['image'])
            img.thumbnail((400, 300))
            self.tk_img = ImageTk.PhotoImage(img)
            self.canvas.itemconfig(self.image_container, image=self.tk_img)
        except Exception as e:
            print(f"Error loading image: {e}")
        
        self.canvas.itemconfig(self.text_container, text=card['finnish'])
        self.is_front = True
    
    def flip_card(self):
        if self.is_front:
            self.canvas.itemconfig(self.text_container, 
                                  text=self.cards[self.current_card]['english'])
            self.is_front = False
        else:
            self.canvas.itemconfig(self.text_container, 
                                  text=self.cards[self.current_card]['finnish'])
            self.is_front = True
    
    def next_card(self):
        self.current_card = (self.current_card + 1) % len(self.cards)
        self.show_card()
        self.is_front = True

if __name__ == "__main__":
    root = tk.Tk()
    app = FlashCardApp(root)
    root.mainloop()