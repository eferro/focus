import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import TaskInput from '../TaskInput';

describe('TaskInput', () => {
  it('renders with default placeholder', () => {
    render(<TaskInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Enter your task...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<TaskInput value="" onChange={() => {}} placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('calls onChange with input value', () => {
    const handleChange = vi.fn();
    render(<TaskInput value="" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Enter your task...');
    const testValue = 'New task';
    
    // Simulate typing by changing the input value
    input.focus();
    input.setAttribute('value', testValue);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    expect(handleChange).toHaveBeenCalledWith(testValue);
  });

  it('displays the provided value', () => {
    render(<TaskInput value="Existing task" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TaskInput value="" onChange={() => {}} className="custom-class" />);
    expect(screen.getByPlaceholderText('Enter your task...')).toHaveClass('custom-class');
  });
}); 