import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "play_store_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

LOGO_PATH = "assets/images/logo.png"
LAUNCH_DIR = "launch"

# Find launch images
launch_files = sorted([os.path.join(LAUNCH_DIR, f) for f in os.listdir(LAUNCH_DIR) if f.endswith(('.jpeg', '.jpg', '.png'))])
img_dashboard = launch_files[0] if len(launch_files) > 0 else None
img_services = launch_files[1] if len(launch_files) > 1 else None
img_topup = launch_files[2] if len(launch_files) > 2 else None

def get_font(size, bold=True):
    font_names = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for fn in font_names:
        if os.path.exists(fn):
            try:
                return ImageFont.truetype(fn, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_vertical_gradient(width, height, color_top, color_bottom):
    base = Image.new("RGBA", (width, height), color_top)
    top_r, top_g, top_b = color_top[:3]
    bot_r, bot_g, bot_b = color_bottom[:3]
    draw = ImageDraw.Draw(base)
    for y in range(height):
        factor = y / float(height)
        r = int(top_r + (bot_r - top_r) * factor)
        g = int(top_g + (bot_g - top_g) * factor)
        b = int(bot_b + (bot_b - top_b) * factor)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
    return base

def get_circular_logo(size=120):
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo_resized = logo.resize((size, size), Image.Resampling.LANCZOS)
    
    # Circular mask
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, size, size], fill=255)
    
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(logo_resized, (0, 0), mask)
    
    # Add subtle circular border
    border_draw = ImageDraw.Draw(out)
    border_draw.ellipse([1, 1, size-2, size-2], outline=(234, 179, 8, 200), width=2)
    return out

def create_phone_mockup(screen_image_path, target_width=720, target_height=1500, corner_radius=46):
    screen = Image.open(screen_image_path).convert("RGBA")
    
    # Clean up status bar from raw screenshot by cropping the messy status area if needed,
    # or let the screen display inside a modern smartphone chassis
    # Crop raw top status bar (top 3.5%) to keep it pristine and modern
    orig_w, orig_h = screen.size
    crop_top = int(orig_h * 0.038)
    crop_bottom = int(orig_h * 0.015)
    screen_cropped = screen.crop((0, crop_top, orig_w, orig_h - crop_bottom))
    
    screen_resized = screen_cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    bezel = 14
    phone_w = target_width + bezel * 2
    phone_h = target_height + bezel * 2
    
    # 1. Screen rounded mask
    screen_mask = Image.new("L", (target_width, target_height), 0)
    draw_smask = ImageDraw.Draw(screen_mask)
    draw_smask.rounded_rectangle([0, 0, target_width, target_height], radius=corner_radius - 8, fill=255)
    
    # 2. Outer phone body
    phone_body = Image.new("RGBA", (phone_w, phone_h), (0, 0, 0, 0))
    draw_phone = ImageDraw.Draw(phone_body)
    
    # Metallic Dark Sleek Frame
    draw_phone.rounded_rectangle([0, 0, phone_w, phone_h], radius=corner_radius, fill=(15, 23, 42, 255), outline=(37, 99, 235, 180), width=3)
    draw_phone.rounded_rectangle([bezel-2, bezel-2, phone_w - bezel + 2, phone_h - bezel + 2], radius=corner_radius - 4, outline=(30, 41, 59, 255), width=2)
    
    # Paste clean screen
    phone_body.paste(screen_resized, (bezel, bezel), screen_mask)
    
    # Clean top speaker slit in bezel (not over screen text)
    speaker_w, speaker_h = 70, 4
    speaker_x = (phone_w - speaker_w) // 2
    speaker_y = (bezel - speaker_h) // 2
    draw_phone.rounded_rectangle([speaker_x, speaker_y, speaker_x + speaker_w, speaker_y + speaker_h], radius=2, fill=(45, 55, 72, 255))
    
    # 3. Drop Shadow
    shadow_pad = 60
    canvas_w = phone_w + shadow_pad * 2
    canvas_h = phone_h + shadow_pad * 2
    
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    shadow_mask = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_mask)
    shadow_draw.rounded_rectangle(
        [shadow_pad + 6, shadow_pad + 18, shadow_pad + phone_w - 6, shadow_pad + phone_h + 18],
        radius=corner_radius + 4,
        fill=(0, 0, 0, 180)
    )
    blurred_shadow = shadow_mask.filter(ImageFilter.GaussianBlur(radius=30))
    canvas.paste(blurred_shadow, (0, 0), blurred_shadow)
    canvas.paste(phone_body, (shadow_pad, shadow_pad), phone_body)
    return canvas

def generate_playstore_icon():
    print("Generating Play Store App Icon (512x512)...")
    icon_size = 512
    img = Image.new("RGBA", (icon_size, icon_size), (0, 0, 0, 0))
    
    # Clean pure white background with subtle rounded mask
    bg = Image.new("RGBA", (icon_size, icon_size), (255, 255, 255, 255))
    
    # Load and fit SM DATA logo
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo_target_size = 460
    logo_resized = logo.resize((logo_target_size, logo_target_size), Image.Resampling.LANCZOS)
    
    offset_x = (icon_size - logo_target_size) // 2
    offset_y = (icon_size - logo_target_size) // 2
    bg.paste(logo_resized, (offset_x, offset_y), logo_resized)
    
    # Save standard 512x512 PNG
    bg.save(os.path.join(OUTPUT_DIR, "icon_512x512.png"), format="PNG")
    print("  -> Saved icon_512x512.png")

def generate_feature_graphic():
    print("Generating Feature Graphic (1024x500)...")
    W, H = 1024, 500
    
    # Base background: Deep sleek blue with glowing radial accents
    bg = draw_vertical_gradient(W, H, (10, 20, 42, 255), (15, 23, 42, 255))
    
    # Decorative ambient glowing circles / arcs
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse([-80, -80, 480, 480], fill=(37, 99, 235, 80))
    glow_draw.ellipse([650, 80, 1150, 580], fill=(234, 179, 8, 45))
    glow_draw.ellipse([350, 200, 850, 700], fill=(29, 78, 216, 65))
    blurred_glow = glow_layer.filter(ImageFilter.GaussianBlur(radius=70))
    bg.paste(blurred_glow, (0, 0), blurred_glow)
    
    # Grid lines
    line_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    line_draw = ImageDraw.Draw(line_layer)
    for i in range(0, W, 70):
        line_draw.line([(i, 0), (i + 120, H)], fill=(255, 255, 255, 10), width=1)
    bg.paste(line_layer, (0, 0), line_layer)
    
    draw = ImageDraw.Draw(bg)
    
    # Left Content: Circular Logo + Brand Name + Tagline
    circ_logo = get_circular_logo(size=110)
    bg.paste(circ_logo, (60, 45), circ_logo)
    
    # Text Titles
    f_brand = get_font(42, bold=True)
    f_sub = get_font(20, bold=False)
    
    draw.text((190, 55), "SM DATA", font=f_brand, fill=(255, 255, 255, 255))
    draw.text((190, 108), "Instant VTU & Telecom Solutions", font=f_sub, fill=(234, 179, 8, 255))
    
    # Main pitch
    draw.text((60, 185), "Fastest & Most Affordable Data in Nigeria", font=get_font(24, bold=True), fill=(255, 255, 255, 255))
    draw.text((60, 225), "Instant automated top-ups, wallet funding & 24/7 reliability.", font=get_font(17, bold=False), fill=(203, 213, 225, 255))
    
    # Feature Badges
    badges = [
        ("• Fast Data Bundles", (37, 99, 235)),
        ("• Instant Airtime VTU", (234, 179, 8)),
        ("• WAEC / NECO PINs", (16, 185, 129)),
        ("• Electricity & Bills", (139, 92, 246))
    ]
    
    badge_x = 60
    badge_y = 285
    f_badge = get_font(15, bold=True)
    
    for i, (btext, bcolor) in enumerate(badges):
        col = i % 2
        row = i // 2
        bx = badge_x + col * 235
        by = badge_y + row * 48
        
        pill_w = 218
        pill_h = 36
        draw.rounded_rectangle([bx, by, bx + pill_w, by + pill_h], radius=18, fill=(24, 32, 47, 230), outline=(*bcolor, 160), width=1)
        draw.text((bx + 18, by + 8), btext, font=f_badge, fill=(241, 245, 249, 255))
    
    # Trust badge
    draw.text((60, 425), "• 100% Automated Delivery     • 24/7 Dedicated Customer Support", font=get_font(16, bold=True), fill=(148, 163, 184, 255))
    
    # Right Content: High-impact Phone Showcase
    if img_dashboard:
        mockup = create_phone_mockup(img_dashboard, target_width=320, target_height=650, corner_radius=30)
        mock_w = 400
        mock_h = int(mockup.height * (mock_w / mockup.width))
        mockup_scaled = mockup.resize((mock_w, mock_h), Image.Resampling.LANCZOS)
        bg.paste(mockup_scaled, (645, 30), mockup_scaled)
        
    # Save Feature Graphic in PNG and JPG
    bg.save(os.path.join(OUTPUT_DIR, "feature_graphic_1024x500.png"), format="PNG")
    bg.convert("RGB").save(os.path.join(OUTPUT_DIR, "feature_graphic_1024x500.jpg"), format="JPEG", quality=95)
    print("  -> Saved feature_graphic_1024x500.png / .jpg")

def generate_store_screenshots():
    print("Generating Store Showcase Screenshots (1080x2400)...")
    W, H = 1080, 2400
    
    configs = [
        {
            "tag": "DASHBOARD & WALLET",
            "title": "Smart VTU & Data Hub",
            "subtitle": "Fast wallet funding, live balances & automated service",
            "image": img_dashboard,
            "filename": "screenshot_1_dashboard.png",
            "accent_color": (37, 99, 235), # Blue
            "highlight_color": (234, 179, 8) # Amber
        },
        {
            "tag": "ALL-IN-ONE SOLUTION",
            "title": "Comprehensive Services",
            "subtitle": "Affordable Data bundles, Airtime, Exam PINs & Utilities",
            "image": img_services,
            "filename": "screenshot_2_services.png",
            "accent_color": (16, 185, 129), # Green
            "highlight_color": (59, 130, 246)
        },
        {
            "tag": "INSTANT DISPATCH",
            "title": "Instant Airtime & Data",
            "subtitle": "Automated top-up for MTN, Airtel, Glo & 9mobile in seconds",
            "image": img_topup,
            "filename": "screenshot_3_topup.png",
            "accent_color": (245, 158, 11), # Warm Amber
            "highlight_color": (37, 99, 235)
        }
    ]
    
    for cfg in configs:
        if not cfg["image"]:
            continue
            
        print(f"  Rendering {cfg['filename']}...")
        
        # 1. Background gradient
        bg = draw_vertical_gradient(W, H, (10, 18, 36, 255), (15, 23, 42, 255))
        
        # Ambient Lighting Glow
        glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow_layer)
        glow_draw.ellipse([W//2 - 420, 80, W//2 + 420, 880], fill=(*cfg["accent_color"], 75))
        glow_draw.ellipse([W//2 - 320, 1150, W//2 + 320, 1850], fill=(*cfg["highlight_color"], 35))
        blurred_glow = glow_layer.filter(ImageFilter.GaussianBlur(radius=110))
        bg.paste(blurred_glow, (0, 0), blurred_glow)
        
        # Circular Logo at top
        circ_logo = get_circular_logo(size=96)
        bg.paste(circ_logo, (W//2 - 48, 100), circ_logo)
        
        draw = ImageDraw.Draw(bg)
        
        # Category Tag Pill
        f_tag = get_font(26, bold=True)
        tag_text = cfg["tag"]
        tag_bbox = draw.textbbox((0, 0), tag_text, font=f_tag)
        tag_w = tag_bbox[2] - tag_bbox[0] + 48
        tag_h = 52
        tag_x = (W - tag_w) // 2
        tag_y = 220
        
        draw.rounded_rectangle([tag_x, tag_y, tag_x + tag_w, tag_y + tag_h], radius=26, fill=(24, 32, 47, 230), outline=(*cfg["accent_color"], 220), width=2)
        draw.text((tag_x + 24, tag_y + 11), tag_text, font=f_tag, fill=(*cfg["highlight_color"], 255))
        
        # Main Headline
        f_title = get_font(62, bold=True)
        title_bbox = draw.textbbox((0, 0), cfg["title"], font=f_title)
        title_x = (W - (title_bbox[2] - title_bbox[0])) // 2
        title_y = 300
        draw.text((title_x, title_y), cfg["title"], font=f_title, fill=(255, 255, 255, 255))
        
        # Subtitle
        f_sub = get_font(32, bold=False)
        sub_bbox = draw.textbbox((0, 0), cfg["subtitle"], font=f_sub)
        sub_x = (W - (sub_bbox[2] - sub_bbox[0])) // 2
        sub_y = 390
        draw.text((sub_x, sub_y), cfg["subtitle"], font=f_sub, fill=(203, 213, 225, 255))
        
        # Phone Mockup Frame
        mockup = create_phone_mockup(cfg["image"], target_width=820, target_height=1720, corner_radius=50)
        
        mock_x = (W - mockup.width) // 2
        mock_y = 475
        
        bg.paste(mockup, (mock_x, mock_y), mockup)
        
        # Save output
        out_path = os.path.join(OUTPUT_DIR, cfg["filename"])
        bg.save(out_path, format="PNG")
        print(f"  -> Saved {cfg['filename']}")

if __name__ == "__main__":
    generate_playstore_icon()
    generate_feature_graphic()
    generate_store_screenshots()
    print("\nAll Google Play Store launch graphics regenerated successfully!")
