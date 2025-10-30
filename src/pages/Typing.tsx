import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw } from "lucide-react";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.",
  "Practice makes perfect. The more you type, the faster and more accurate you will become at typing.",
  "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
  "Web development involves building and maintaining websites. It includes aspects such as web design, web publishing, and database management.",
];

const Typing = () => {
  const [currentText, setCurrentText] = useState(sampleTexts[0]);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (userInput.length === 0) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) {
        correctChars++;
      }
    }
    const accuracyPercentage = Math.round((correctChars / userInput.length) * 100);
    setAccuracy(accuracyPercentage);

    // Calculate WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      const wordsTyped = userInput.length / 5; // standard word length
      const calculatedWpm = Math.round(wordsTyped / timeElapsed);
      setWpm(calculatedWpm || 0);
    }

    // Check if complete
    if (userInput.length === currentText.length) {
      setIsComplete(true);
    }
  }, [userInput, currentText, startTime]);

  const handleRestart = () => {
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
    setCurrentText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return "text-muted-foreground";
    return userInput[index] === currentText[index]
      ? "text-primary"
      : "text-destructive";
  };

  const progress = Math.round((userInput.length / currentText.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Typing Practice</h1>
            <p className="text-muted-foreground">
              Type the text below as accurately and quickly as possible
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary">{wpm}</div>
              <div className="text-sm text-muted-foreground mt-1">Words Per Minute</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary">{accuracy}%</div>
              <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary">{progress}%</div>
              <div className="text-sm text-muted-foreground mt-1">Progress</div>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />

          {/* Text Display */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-xl leading-relaxed font-mono">
              {currentText.split("").map((char, index) => (
                <span key={index} className={getCharacterClass(index)}>
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <Textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => !isComplete && setUserInput(e.target.value)}
              placeholder="Start typing here..."
              className="min-h-[150px] text-lg font-mono"
              disabled={isComplete}
            />
            
            {isComplete && (
              <div className="bg-primary/10 border border-primary rounded-lg p-6 text-center space-y-4">
                <h2 className="text-2xl font-bold text-primary">Great Job!</h2>
                <p className="text-muted-foreground">
                  You completed the exercise with {accuracy}% accuracy at {wpm} WPM
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button onClick={handleRestart} size="lg" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                {isComplete ? "Try Another Text" : "Restart"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Typing;
