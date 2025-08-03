# 🤝 Contributing to AI Voice Chat App

Thank you for your interest in contributing to the AI Voice Chat App! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🎯 How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide your operating system and browser information
- Include any error messages or console logs

### Suggesting Enhancements

- Use the GitHub issue tracker with the "enhancement" label
- Describe the feature and why it would be useful
- Include mockups or examples if applicable

### Code Contributions

- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/AI_VOICE_APP.git
   cd AI_VOICE_APP
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cd ../server
   cp env.example .env
   
   # Edit .env and add your Gemini API key
   nano .env
   ```

4. **Start development servers**
   ```bash
   # Start server (from server directory)
   npm start
   
   # Start client (from client directory, in new terminal)
   cd ../client
   npm start
   ```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows the coding standards**
2. **Add tests for new functionality**
3. **Update documentation if needed**
4. **Test your changes thoroughly**

### Pull Request Guidelines

1. **Use a clear and descriptive title**
2. **Provide a detailed description of changes**
3. **Include screenshots for UI changes**
4. **Reference any related issues**
5. **Ensure all tests pass**

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Updated existing tests

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective
- [ ] New and existing unit tests pass locally
```

## 📝 Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add JSDoc comments for functions

### CSS

- Use modern CSS features
- Follow BEM methodology
- Implement responsive design
- Use CSS custom properties
- Ensure accessibility

### General

- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Follow the existing code style
- Use consistent indentation

### Code Style Example

```javascript
/**
 * Processes audio input and sends to AI
 * @param {File} audioFile - The audio file to process
 * @returns {Promise<Object>} The AI response
 */
const processAudio = async (audioFile) => {
  try {
    // Validate input
    if (!audioFile || audioFile.size < 1000) {
      throw new Error('Invalid audio file');
    }

    // Process audio
    const result = await sendToAI(audioFile);
    return result;
  } catch (error) {
    console.error('Audio processing failed:', error);
    throw error;
  }
};
```

## 🧪 Testing

### Running Tests

```bash
# Run client tests
cd client
npm test

# Run server tests
cd ../server
npm test
```

### Writing Tests

- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Test both success and error cases

### Test Example

```javascript
describe('Audio Processing', () => {
  test('should process valid audio file', async () => {
    const mockAudioFile = new File(['test'], 'test.webm', { type: 'audio/webm' });
    const result = await processAudio(mockAudioFile);
    expect(result).toBeDefined();
  });

  test('should throw error for invalid file', async () => {
    await expect(processAudio(null)).rejects.toThrow('Invalid audio file');
  });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Keep README updated

### API Documentation

- Document all API endpoints
- Include request/response examples
- Explain error codes
- Provide usage examples

### User Documentation

- Update user guides
- Add screenshots for new features
- Include troubleshooting steps
- Keep deployment guide current

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Create release notes
- [ ] Tag the release
- [ ] Deploy to production

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]

## Additional Context
Any other context about the problem
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like this feature to work?

## Alternatives Considered
Any alternative solutions you've considered

## Additional Context
Any other context or screenshots
```

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general help
- **Documentation**: Check the README and docs first

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

---

**Thank you for contributing to AI Voice Chat App! 🎉** 