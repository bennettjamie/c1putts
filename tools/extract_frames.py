"""
YouTube Frame Extractor for YOLO Training Data
==============================================

This script downloads YouTube videos and extracts frames for YOLO training.

Usage:
    python extract_frames.py <youtube_url> --output ./frames --interval 30

Requirements:
    pip install yt-dlp opencv-python

Recommended YouTube Videos for Disc Golf Training:
    - "Practice Like a Pro: Disc Golf Putting Routine" (Avery Jenkins)
    - "Improve Your C1X Percentage with 3 Putting Drills"
    - "How To Putt In Disc Golf (With Gannon Buhr)"
    - "Disc Golf Putting Drills" (Foundation Disc Golf)
    - Search: "disc golf putting practice" for more
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path

def download_video(url: str, output_path: str) -> str:
    """Download YouTube video using yt-dlp"""
    output_file = os.path.join(output_path, "video.mp4")
    
    cmd = [
        "yt-dlp",
        "-f", "best[height<=720]",  # Max 720p to save space
        "-o", output_file,
        url
    ]
    
    print(f"Downloading: {url}")
    subprocess.run(cmd, check=True)
    return output_file


def extract_frames(video_path: str, output_dir: str, interval: int = 30):
    """Extract frames from video at specified interval (in frames)"""
    try:
        import cv2
    except ImportError:
        print("Please install opencv-python: pip install opencv-python")
        sys.exit(1)
    
    os.makedirs(output_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    print(f"Video: {fps} FPS, {total_frames} total frames")
    print(f"Extracting every {interval} frames (~{interval/fps:.1f} seconds)")
    
    frame_count = 0
    saved_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_count % interval == 0:
            filename = os.path.join(output_dir, f"frame_{saved_count:05d}.jpg")
            cv2.imwrite(filename, frame)
            saved_count += 1
            
            if saved_count % 10 == 0:
                print(f"Saved {saved_count} frames...")
        
        frame_count += 1
    
    cap.release()
    print(f"Done! Extracted {saved_count} frames to {output_dir}")
    return saved_count


def main():
    parser = argparse.ArgumentParser(description="Extract frames from YouTube videos for YOLO training")
    parser.add_argument("url", help="YouTube video URL")
    parser.add_argument("--output", "-o", default="./training_frames", help="Output directory")
    parser.add_argument("--interval", "-i", type=int, default=30, help="Extract every N frames (default: 30)")
    parser.add_argument("--skip-download", action="store_true", help="Skip download, use existing video.mp4")
    
    args = parser.parse_args()
    
    # Create output directory
    output_path = Path(args.output)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Download video
    video_file = os.path.join(args.output, "video.mp4")
    if not args.skip_download:
        video_file = download_video(args.url, args.output)
    
    # Extract frames
    frames_dir = os.path.join(args.output, "frames")
    extract_frames(video_file, frames_dir, args.interval)
    
    print(f"\nNext steps:")
    print(f"1. Upload frames from '{frames_dir}' to Roboflow")
    print(f"2. Label objects: basket, chains, disc, person, etc.")
    print(f"3. Add more videos for variety!")


if __name__ == "__main__":
    main()
