import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";

interface TagsInputProps {
  initialTags?: string[];
  onChange?: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

const TagsInput: React.FC<TagsInputProps> = ({
  initialTags = [],
  onChange,
  maxTags = 10,
  placeholder = "Add tags (press Enter or comma to add)",
  label = "Tags",
  disabled = false,
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState<string>("");

  const handleAddTag = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent
  ): void => {
    e.preventDefault();

    if (disabled || tags.length >= maxTags) return;

    const trimmedInput = tagInput.trim();
    if (trimmedInput !== "" && !tags.includes(trimmedInput)) {
      const newTags = [...tags, trimmedInput];
      setTags(newTags);
      setTagInput("");

      if (onChange) {
        onChange(newTags);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    if (disabled) return;

    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);

    if (onChange) {
      onChange(newTags);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if ((e.key === "Enter" || e.key === ",") && !disabled) {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTagInput(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            #{tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemoveTag(tag)}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove tag</span>
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          value={tagInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-grow"
          disabled={disabled || tags.length >= maxTags}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleAddTag}
          disabled={
            disabled || tags.length >= maxTags || tagInput.trim() === ""
          }
        >
          Add
        </Button>
      </div>

      {tags.length >= maxTags && (
        <p className="text-xs text-destructive">
          Maximum number of tags reached ({maxTags})
        </p>
      )}

      {tags.length < maxTags && (
        <p className="text-xs text-muted-foreground">
          Press Enter or comma to add a tag ({tags.length}/{maxTags})
        </p>
      )}
    </div>
  );
};

export default TagsInput;
